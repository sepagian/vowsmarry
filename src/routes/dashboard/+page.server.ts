import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { eq, count, sum } from 'drizzle-orm';
import * as table from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        throw redirect(302, '/login');
    }

    // Get user's wedding
    const wedding = await db.query.weddings.findFirst({
        where: eq(table.weddings.userId, locals.user.id)
    });

    if (!wedding) {
        return {
            user: locals.user,
            wedding: null,
            savings: null,
            stats: {
                documents: { total: 0, pending: 0, approved: 0 },
                todos: { total: 0, todo: 0, inProgress: 0, done: 0 },
                budget: { total: 0, spent: 0, remaining: 0 },
                vendors: { total: 0, contacted: 0, booked: 0 }
            },
            recentTasks: [],
            upcomingDeadlines: []
        };
    }

    // Get savings summary
    const savings = await db.query.savingsSummaries.findFirst({
        where: eq(table.savingsSummaries.weddingId, wedding.id)
    });

    // Get document stats
    const documentStats = await db
        .select({
            status: table.documents.status,
            count: count()
        })
        .from(table.documents)
        .where(eq(table.documents.weddingId, wedding.id))
        .groupBy(table.documents.status);

    // Get todo stats  
    const todoStats = await db
        .select({
            status: table.todos.status,
            count: count()
        })
        .from(table.todos)
        .where(eq(table.todos.weddingId, wedding.id))
        .groupBy(table.todos.status);

    // Get recent tasks (last 5)
    const recentTasks = await db.query.todos.findMany({
        where: eq(table.todos.weddingId, wedding.id),
        orderBy: (todos, { desc }) => [desc(todos.createdAt)],
        limit: 5
    });

    // Get budget totals
    const budgetTotals = await db
        .select({
            plannedTotal: sum(table.budgetItems.plannedAmount),
            actualTotal: sum(table.budgetItems.actualAmount)
        })
        .from(table.budgetItems)
        .where(eq(table.budgetItems.weddingId, wedding.id));

    // Get vendor stats
    const vendorStats = await db
        .select({
            status: table.vendors.status,
            count: count()
        })
        .from(table.vendors)
        .where(eq(table.vendors.weddingId, wedding.id))
        .groupBy(table.vendors.status);

    // Get upcoming deadlines (tasks and documents with due dates)
    const upcomingTasks = await db.query.todos.findMany({
        where: eq(table.todos.weddingId, wedding.id),
        orderBy: (todos, { asc }) => [asc(todos.dueDate)],
        limit: 3
    });

    const upcomingDocuments = await db.query.documents.findMany({
        where: eq(table.documents.weddingId, wedding.id),
        orderBy: (documents, { asc }) => [asc(documents.dueDate)],
        limit: 2
    });

    // Process stats
    const docStatsMap: Record<string, number> = {};
    documentStats.forEach(stat => {
        if (stat.status) {
            docStatsMap[stat.status] = stat.count;
        }
    });

    const todoStatsMap: Record<string, number> = {};
    todoStats.forEach(stat => {
        if (stat.status) {
            todoStatsMap[stat.status] = stat.count;
        }
    });

    const vendorStatsMap: Record<string, number> = {};
    vendorStats.forEach(stat => {
        if (stat.status) {
            vendorStatsMap[stat.status] = stat.count;
        }
    });

    const budgetTotal = Number(budgetTotals[0]?.plannedTotal || 0);
    const budgetSpent = Number(budgetTotals[0]?.actualTotal || 0);

    // Combine upcoming deadlines
    const upcomingDeadlines = [
        ...upcomingTasks.filter(task => task.dueDate).map(task => ({
            title: task.title,
            date: task.dueDate!,
            type: 'task' as const,
            status: task.status || 'todo'
        })),
        ...upcomingDocuments.filter(doc => doc.dueDate).map(doc => ({
            title: doc.title,
            date: doc.dueDate!,
            type: 'document' as const,
            status: doc.status || 'pending'
        }))
    ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 5);

    return {
        user: locals.user,
        wedding,
        savings,
        stats: {
            documents: {
                total: documentStats.reduce((sum, stat) => sum + stat.count, 0),
                pending: docStatsMap.pending || 0,
                approved: docStatsMap.approved || 0
            },
            todos: {
                total: todoStats.reduce((sum, stat) => sum + stat.count, 0),
                todo: todoStatsMap.todo || 0,
                inProgress: todoStatsMap.in_progress || 0,
                done: todoStatsMap.done || 0
            },
            budget: {
                total: budgetTotal,
                spent: budgetSpent,
                remaining: budgetTotal - budgetSpent
            },
            vendors: {
                total: vendorStats.reduce((sum, stat) => sum + stat.count, 0),
                contacted: vendorStatsMap.contacted || 0,
                booked: vendorStatsMap.booked || 0
            }
        },
        recentTasks,
        upcomingDeadlines
    };
};