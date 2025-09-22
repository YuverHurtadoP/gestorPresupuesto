import { Router } from "express";
import { createExpense, getExpensesByBudget, updateExpense, deleteExpense,getExpensesSummaryByBudget } from "../controllers/expenseController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

// Crear gasto
router.post("/create", authMiddleware, createExpense);

// Listar gastos por presupuesto
router.get("/:presupuestoId", authMiddleware, getExpensesByBudget);
router.get("/:presupuestoId/summary", authMiddleware, getExpensesSummaryByBudget);

// Actualizar gasto
router.put("/:id", authMiddleware, updateExpense);

router.delete("/:id", authMiddleware, deleteExpense)
export default router;
