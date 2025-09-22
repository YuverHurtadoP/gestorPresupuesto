import { Expense } from "../entities/Expense";

export interface ExpenseRepository {
  create(expense: Expense): Promise<Expense>;
  findById(id: string): Promise<Expense | null>;
  findByUser(userId: string): Promise<Expense[]>;
  findByBudget(budgetId: string): Promise<Expense[]>;
  update(expense: Expense): Promise<Expense>;
  delete(id: string): Promise<void>;
}
