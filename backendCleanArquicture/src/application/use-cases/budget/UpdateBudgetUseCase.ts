import { Budget } from "../../../domain/entities/Budget";
import { IBudgetRepository } from "../../../domain/repositories/IBudgetRepository";


export class UpdateBudgetUseCase {
    constructor(private budgetRepository: IBudgetRepository) { }

    async execute(
        id: string,
        userId: string,
        nombre: string,
        valor: number,
        descripcion?: string
    ): Promise<Budget> {
        const budget = new Budget(
            nombre,
            valor,
            userId,
            descripcion,
            id, // 👈 importante pasar el ID para que el repo sepa cuál actualizar
            new Date(), // updatedAt lo maneja mongoose pero enviamos referencia
            new Date()
        );

        return this.budgetRepository.update(budget);
    }
}
