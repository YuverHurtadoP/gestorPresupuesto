import { Router } from "express";
import { registerUser, loginUser,updateUser } from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";
const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.put("/edit", authMiddleware,  updateUser);

export default router;
