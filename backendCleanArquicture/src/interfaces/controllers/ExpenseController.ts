import { Request, Response } from "express";
import { MongoExpenseRepository } from "../../infrastructure/repositories/MongoExpenseRepository";
import { CreateExpenseUseCase } from "../../application/use-cases/expense/CreateExpenseUseCase";
import { DeleteExpenseUseCase } from "../../application/use-cases/expense/DeleteExpenseUseCase";
import { FindExpensesByBudgetUseCase } from "../../application/use-cases/expense/FindExpensesByBudgetUseCase";
import { GetExpenseSummaryByBudgetUseCase } from "../../application/use-cases/expense/GetExpenseSummaryByBudgetUseCase";
import { UpdateExpenseUseCase } from "../../application/use-cases/expense/UpdateExpenseUseCase";
 
const expenseRepository = new MongoExpenseRepository();

export class ExpenseController {
 
  static async create(req: Request & { userId?: string }, res: Response) {
    try {
      const { nombre, descripcion, valor, presupuestoId } = req.body;

      const useCase = new CreateExpenseUseCase(expenseRepository);
      const expense = await useCase.execute(
        nombre,
        valor,
        presupuestoId,
        req.userId!,
        descripcion
      );

      res.status(201).json({
        message: "Gasto creado correctamente",
        expense,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  
   static async update(req: Request & { userId?: string }, res: Response) {
    try {
      console.log('updta desde el contrller',req)
      
      const { id } = req.params;
      const { nombre, descripcion, valor } = req.body;

      const useCase = new UpdateExpenseUseCase(expenseRepository);
      const expense = await useCase.execute(
        id,
        req.userId!,
        nombre,
        valor,
        descripcion,
      
      );

      res.status(200).json({
        message: "Gasto actualizado correctamente",
        expense,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  } 
 
 
static async findByBudget(req: Request & { userId?: string }, res: Response) {
  try {
    const { presupuestoId } = req.params;
    const { page = 1, limit = 10, search = "" } = req.query;

    const useCase = new FindExpensesByBudgetUseCase(expenseRepository);
    const result = await useCase.execute(
      presupuestoId,
      req.userId!,
      +page,
      +limit,
      search as string
    );

    res.status(200).json({
      message: "Gastos obtenidos correctamente",
      ...result,
    });
  } catch (error: any) {
    if (error.message === "Presupuesto no encontrado o no autorizado") {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Error inesperado", error: error.message });
    }
  }
}


  
  static async delete(req: Request & { userId?: string }, res: Response) {
    try {
      const { id } = req.params;

      const useCase = new DeleteExpenseUseCase(expenseRepository);
      await useCase.execute(id, req.userId!);

      res.status(200).json({
        message: "Gasto eliminado correctamente",
        expenseId: id,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  
  static async getSummaryByBudget(
    req: Request & { userId?: string },
    res: Response
  ) {
    try {
      const { presupuestoId } = req.params;

      const useCase = new GetExpenseSummaryByBudgetUseCase(expenseRepository);
      const summary = await useCase.execute(presupuestoId, req.userId!);

      res.status(200).json({
        message: "Resumen de gastos obtenido correctamente",
        summary,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
