import { IExpenseRepository } from "../../../domain/repositories/IExpenseRepository";

export class DeleteExpenseUseCase {
    constructor(private expenseRepository: IExpenseRepository) { }

    async execute(id: string, userId: string): Promise<void> {
        return this.expenseRepository.delete(id, userId);
    }
}
