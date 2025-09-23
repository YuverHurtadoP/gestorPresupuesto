import { Expense } from "../../../domain/entities/Expense";
import { IExpenseRepository } from "../../../domain/repositories/IExpenseRepository";


export class UpdateExpenseUseCase {
    constructor(private expenseRepository: IExpenseRepository) { }

    async execute(
        id: string,
        userId: string,
        nombre: string,
        valor: number,
        descripcion?: string
    ): Promise<Expense> {
        // buscar el gasto original
        const existing = await this.expenseRepository.findById(id, userId);
        if (!existing) {
            throw new Error("Gasto no encontrado o no autorizado");
        }

        // crear una entidad Expense actualizada
        const updatedExpense = new Expense(
            nombre,                          
            valor,                           
            existing.presupuestoId,          
            userId,                          
            descripcion || existing.descripcion, 
            id,                              
            existing.createdAt,              
            new Date()                      
        );

        // guardar los cambios
        return this.expenseRepository.update(updatedExpense);
    }
}
