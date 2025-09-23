import { IExpenseRepository } from "../../../domain/repositories/IExpenseRepository";

export class GetExpenseSummaryByBudgetUseCase {
  constructor(private expenseRepository: IExpenseRepository) { }

  async execute(
    presupuestoId: string,
    userId: string
  ): Promise<any> {
    return this.expenseRepository.getSummaryByBudget(
      presupuestoId,
      userId
    );
  }
}
