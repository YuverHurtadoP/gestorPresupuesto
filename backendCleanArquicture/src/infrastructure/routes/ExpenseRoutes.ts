import { Router } from "express";
 import { authMiddleware } from "../../interfaces/middlewares/authMiddleware";
import { ExpenseController } from "../../interfaces/controllers/ExpenseController";
 
const router = Router();

 
router.get("/:presupuestoId", authMiddleware, ExpenseController.findByBudget);
router.get("/:presupuestoId/summary", authMiddleware, ExpenseController.getSummaryByBudget);
router.post("/create", authMiddleware, ExpenseController.create);
router.put("/:id", authMiddleware, ExpenseController.update);

router.delete("/:id", authMiddleware, ExpenseController.delete)
 
export default router;
