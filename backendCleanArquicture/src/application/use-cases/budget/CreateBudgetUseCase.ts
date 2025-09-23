 
import { Budget } from "../../../domain/entities/Budget";
import { IBudgetRepository } from "../../../domain/repositories/IBudgetRepository";


export class CreateBudgetUseCase {
    constructor(private budgetRepository: IBudgetRepository) { }

    async execute(nombre: string, valor: number, userId: string, descripcion?: string): Promise<Budget> {
        if (!nombre || !valor) {
            throw new Error("El nombre y el valor son obligatorios");
        }

        const newBudget = new Budget(nombre, valor, userId, descripcion, undefined, new Date(), new Date());
        return this.budgetRepository.save(newBudget);
    }
}
