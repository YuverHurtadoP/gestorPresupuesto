import { Router } from "express";
import { createUser, loginUser } from "../../interfaces/controllers/userController";
 
const router = Router();

 
router.post("/users", createUser);
router.post("/login", loginUser);

 

export default router;
