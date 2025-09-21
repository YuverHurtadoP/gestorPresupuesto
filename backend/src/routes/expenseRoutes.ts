import { Router } from "express";
import { createExpense, getExpensesByBudget, updateExpense } from "../controllers/expenseController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

// Crear gasto
router.post("/create", authMiddleware, createExpense);

// Listar gastos por presupuesto
router.get("/budget/:presupuestoId", authMiddleware, getExpensesByBudget);

// Actualizar gasto
router.put("/:id", authMiddleware, updateExpense);

export default router;
