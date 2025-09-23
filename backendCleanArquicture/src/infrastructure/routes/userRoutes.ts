import { Router } from "express";
import { changePassword, createUser, loginUser } from "../../interfaces/controllers/userController";
import { authMiddleware } from "../../interfaces/middlewares/authMiddleware";
 
const router = Router();

 
router.post("/register", createUser);
router.post("/login", loginUser);
router.put("/change-password", authMiddleware, changePassword);
 

export default router;
