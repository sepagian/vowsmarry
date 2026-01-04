/**
 * Database table name constants
 * Prevents typos and makes refactoring easier
 */
export const TABLES = {
  WEDDINGS: "weddings",
  TASKS: "tasks",
  EXPENSES: "expense_items",
  SAVINGS: "savings_items",
  DOCUMENTS: "documents",
  VENDORS: "vendors",
} as const;

export type TableName = (typeof TABLES)[keyof typeof TABLES];
