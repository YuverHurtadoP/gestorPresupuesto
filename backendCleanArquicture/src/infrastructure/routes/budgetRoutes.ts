// interfaces/routes/budgetRoutes.ts
import { Router } from "express";
import { BudgetController } from "../../interfaces/controllers/BudgetController";
import { authMiddleware } from "../../interfaces/middlewares/authMiddleware";
 
const router = Router();

router.post("/", authMiddleware, BudgetController.create);
router.put("/:id", authMiddleware, BudgetController.update);
router.delete("/:id", authMiddleware, BudgetController.delete);
router.get("/", authMiddleware, BudgetController.findAll);
export default router;
