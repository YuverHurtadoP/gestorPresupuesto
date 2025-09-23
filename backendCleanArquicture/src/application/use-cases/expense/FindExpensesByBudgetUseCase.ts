import { IExpenseRepository } from "../../../domain/repositories/IExpenseRepository";
import { Expense } from "../../../domain/entities/Expense";

export class FindExpensesByBudgetUseCase {
    constructor(private expenseRepository: IExpenseRepository) { }

    async execute(
        presupuestoId: string,
        userId: string,
        page: number,
        limit: number,
        search?: string
    ): Promise<{ expenses: Expense[]; total: number }> {
        return this.expenseRepository.findByBudget(
            presupuestoId,
            userId,
            page,
            limit,
            search
        );
    }
}
