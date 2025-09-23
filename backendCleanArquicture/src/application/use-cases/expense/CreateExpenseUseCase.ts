
import { Expense } from "../../../domain/entities/Expense";
import { IExpenseRepository } from "../../../domain/repositories/IExpenseRepository";

export class CreateExpenseUseCase {
    constructor(private expenseRepository: IExpenseRepository) { }

    async execute(
        nombre: string,
        valor: number,
        presupuestoId: string,
        userId: string,
        descripcion?: string
    ): Promise<Expense> {
        const expense = new Expense(
            nombre,
            valor,
            presupuestoId,
            userId,
            descripcion
        );

        return this.expenseRepository.save(expense);
    }
}
