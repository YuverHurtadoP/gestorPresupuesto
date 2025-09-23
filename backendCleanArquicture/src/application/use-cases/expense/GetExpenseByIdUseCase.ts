import { Expense } from "../../../domain/entities/Expense";
import { IExpenseRepository } from "../../../domain/repositories/IExpenseRepository";

export class GetExpenseByIdUseCase {
    constructor(private expenseRepository: IExpenseRepository) { }

    async execute(id: string, userId: string): Promise<Expense | null> {
        return this.expenseRepository.findById(id, userId);
    }
}
