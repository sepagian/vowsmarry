import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { db } from '$lib/server/db'
import { weddings, savingsSummaries, savingsEntries } from '$lib/server/db/schema'
import { eq, desc } from 'drizzle-orm'

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const { data: { user }, error } = await supabase.auth.getUser()
	
	if (error || !user) {
		redirect(302, '/login')
	}

	// Get user's wedding
	const userWedding = await db.query.weddings.findFirst({
		where: eq(weddings.userId, user.id)
	})

	if (!userWedding) {
		return {
			savingsSummary: null,
			savingsEntries: [],
			savingsStats: {
				goalAmount: 0,
				currentAmount: 0,
				remainingAmount: 0,
				progressPercentage: 0,
				monthlyTarget: 0,
				monthsRemaining: 0,
				totalDeposits: 0,
				totalWithdrawals: 0,
				totalEntries: 0
			}
		}
	}

	// Get savings summary
	const savingsSummary = await db.query.savingsSummaries.findFirst({
		where: eq(savingsSummaries.weddingId, userWedding.id)
	})

	if (!savingsSummary) {
		return {
			savingsSummary: null,
			savingsEntries: [],
			savingsStats: {
				goalAmount: 0,
				currentAmount: 0,
				remainingAmount: 0,
				progressPercentage: 0,
				monthlyTarget: 0,
				monthsRemaining: 0,
				totalDeposits: 0,
				totalWithdrawals: 0,
				totalEntries: 0
			}
		}
	}

	// Get savings entries
	const allSavingsEntries = await db.query.savingsEntries.findMany({
		where: eq(savingsEntries.savingsId, savingsSummary.id),
		orderBy: [desc(savingsEntries.date)]
	})

	// Calculate statistics
	const goalAmount = Number(savingsSummary.goalAmount || 0)
	const currentAmount = Number(savingsSummary.currentAmount || 0)
	const remainingAmount = goalAmount - currentAmount
	const progressPercentage = goalAmount > 0 ? (currentAmount / goalAmount) * 100 : 0
	const monthlyTarget = Number(savingsSummary.monthlyTarget || 0)
	const monthsRemaining = monthlyTarget > 0 ? Math.ceil(remainingAmount / monthlyTarget) : 0

	const totalDeposits = allSavingsEntries
		.filter(entry => entry.type === 'deposit')
		.reduce((sum, entry) => sum + Number(entry.amount || 0), 0)
	
	const totalWithdrawals = allSavingsEntries
		.filter(entry => entry.type === 'withdrawal')
		.reduce((sum, entry) => sum + Number(entry.amount || 0), 0)

	const savingsStats = {
		goalAmount,
		currentAmount,
		remainingAmount,
		progressPercentage,
		monthlyTarget,
		monthsRemaining,
		totalDeposits,
		totalWithdrawals,
		totalEntries: allSavingsEntries.length
	}

	return {
		savingsSummary,
		savingsEntries: allSavingsEntries,
		savingsStats
	}
}