import { createQuery } from "@tanstack/svelte-query";

import type { Expense } from "$lib/types";

type FinanceStats = {
  plannedBudget: string;
  budgetSpent: string;
  totalSavings: string;
  budgetRemaining: string;
  savingProgress: number;
};

type ExpenseResponse = {
  expenses: Expense[];
  financeStats: FinanceStats;
  update: {
    planned: number | null;
    spent: number | null;
  };
};

export function useExpenses() {
  return createQuery<ExpenseResponse>(() => ({
    queryKey: ["expenses"],
    queryFn: async () => {
      const response = await fetch("/api/expenses");
      if (!response.ok) {
        throw new Error("Failed to fetch expenses");
      }
      return response.json();
    },
  }));
}
