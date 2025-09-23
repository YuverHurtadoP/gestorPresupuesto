import { Budget } from "../../../domain/entities/Budget";
import { IBudgetRepository } from "../../../domain/repositories/IBudgetRepository";

 
export class GetBudgetByIdUseCase {
  constructor(private budgetRepository: IBudgetRepository) {}

  async execute(id: string, userId: string): Promise<Budget | null> {
    return this.budgetRepository.findById(id, userId);
  }
}
