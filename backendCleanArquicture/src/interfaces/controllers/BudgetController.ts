import { Request, Response } from "express";
 
import { MongoBudgetRepository } from "../../infrastructure/repositories/MongoBudgetRepository";
import { CreateBudgetUseCase } from "../../application/use-cases/budget/CreateBudgetUseCase";
import { DeleteBudgetUseCase } from "../../application/use-cases/budget/DeleteBudgetUseCase";
import { GetAllBudgetsUseCase } from "../../application/use-cases/budget/GetAllBudgetsUseCase";
import { GetBudgetByIdUseCase } from "../../application/use-cases/budget/GetBudgetByIdUseCase";
import { UpdateBudgetUseCase } from "../../application/use-cases/budget/UpdateBudgetUseCase";

const budgetRepository = new MongoBudgetRepository();

export class BudgetController {
  static async create(req: Request & { userId?: string }, res: Response) {
    try {
      const { nombre, descripcion, valor } = req.body;
      const createBudgetUseCase = new CreateBudgetUseCase(budgetRepository);
      const budget = await createBudgetUseCase.execute(
        nombre,
        valor,
        req.userId!,
        descripcion
      );
      res.status(201).json({ message: "Presupuesto creado correctamente", budget });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async findById(req: Request & { userId?: string }, res: Response) {
    try {
      const { id } = req.params;
      const getBudgetByIdUseCase = new GetBudgetByIdUseCase(budgetRepository);
      const budget = await getBudgetByIdUseCase.execute(id, req.userId!);
      if (!budget) {
        return res.status(404).json({ message: "Presupuesto no encontrado" });
      }
      res.json(budget);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async findAll(req: Request & { userId?: string }, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string | undefined;

      const getAllBudgetsUseCase = new GetAllBudgetsUseCase(budgetRepository);
      const result = await getAllBudgetsUseCase.execute(
        req.userId!,
        page,
        limit,
        search
      );

      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async update(req: Request & { userId?: string }, res: Response) {
    try {
      const { id } = req.params;
      const { nombre, descripcion, valor } = req.body;

      const updateBudgetUseCase = new UpdateBudgetUseCase(budgetRepository);
      const budget = await updateBudgetUseCase.execute(
        id,
        req.userId!,
        nombre,
        valor,
        descripcion
      );

      res.json({ message: "Presupuesto actualizado correctamente", budget });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async delete(req: Request & { userId?: string }, res: Response) {
    try {
      const { id } = req.params;
      const deleteBudgetUseCase = new DeleteBudgetUseCase(budgetRepository);
      await deleteBudgetUseCase.execute(id, req.userId!);
      res.json({ message: "Presupuesto eliminado correctamente" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
