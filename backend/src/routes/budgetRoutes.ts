import { Router } from "express";
import { createBudget, getBudgets,updateBudget, deleteBudget } from "../controllers/budgetController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

// Ruta protegida
router.post("/create", authMiddleware, createBudget);

router.get("/", authMiddleware, getBudgets);

router.put("/:id", authMiddleware, updateBudget);

router.delete("/:id", authMiddleware, deleteBudget); 
export default router;
