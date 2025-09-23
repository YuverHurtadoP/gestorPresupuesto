import { IBudgetRepository } from "../../../domain/repositories/IBudgetRepository";


export class DeleteBudgetUseCase {
    constructor(private budgetRepository: IBudgetRepository) { }

    async execute(id: string, userId: string): Promise<void> {
        await this.budgetRepository.delete(id, userId);
    }
}
