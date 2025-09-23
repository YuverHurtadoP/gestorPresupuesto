import { IBudgetRepository } from "../../../domain/repositories/IBudgetRepository";


export class GetAllBudgetsUseCase {
    constructor(private budgetRepository: IBudgetRepository) { }

    async execute(
        userId: string,
        page: number,
        limit: number,
        search?: string
    ): Promise<{ budgets: any[]; total: number }> {
        return this.budgetRepository.findAll(userId, page, limit, search);
    }
}
