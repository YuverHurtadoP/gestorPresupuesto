import { Budget } from "../entities/Budget";

export interface IBudgetRepository {
  save(budget: Budget): Promise<Budget>;
  findById(id: string, userId: string): Promise<Budget | null>;
  findAll(userId: string, page: number, limit: number, search?: string): Promise<{ budgets: Budget[]; total: number }>;
  update(budget: Budget): Promise<Budget>;
  delete(id: string, userId: string): Promise<void>;
}