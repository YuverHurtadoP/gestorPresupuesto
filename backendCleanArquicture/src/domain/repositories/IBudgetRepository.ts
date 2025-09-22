import { Budget } from "../entities/Budget";

export interface BudgetRepository {
  create(budget: Budget): Promise<Budget>;
  findById(id: string): Promise<Budget | null>;
  findByUser(userId: string): Promise<Budget[]>;
  update(budget: Budget): Promise<Budget>;
  delete(id: string): Promise<void>;
}