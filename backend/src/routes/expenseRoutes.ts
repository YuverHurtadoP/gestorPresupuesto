import { Router } from "express";
import { createExpense, getExpensesByBudget, updateExpense, deleteExpense } from "../controllers/expenseController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

// Crear gasto
router.post("/create", authMiddleware, createExpense);

// Listar gastos por presupuesto
router.get("/:presupuestoId", authMiddleware, getExpensesByBudget);

// Actualizar gasto
router.put("/:id", authMiddleware, updateExpense);

router.delete("/:id", authMiddleware, deleteExpense)
export default router;
