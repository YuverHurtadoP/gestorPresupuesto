// domain/repositories/IExpenseRepository.ts
import { Expense } from "../entities/Expense";

export interface IExpenseRepository {
  save(expense: Expense): Promise<Expense>;
  update(expense: Expense): Promise<Expense>;
  findById(id: string, userId: string): Promise<Expense | null>;
  findByBudget(
    presupuestoId: string,
    userId: string,
    page: number,
    limit: number,
    search?: string
  ): Promise<{ expenses: Expense[]; total: number }>;
  delete(id: string, userId: string): Promise<void>;
  getSummaryByBudget(presupuestoId: string, userId: string): Promise<any>;
}
