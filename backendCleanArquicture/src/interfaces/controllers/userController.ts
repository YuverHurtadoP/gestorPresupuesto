import { Request, Response } from "express";
import { MongoUserRepository } from "../../infrastructure/repositories/MongoUserRepository";
import { CreateUserUseCase } from "../../application/use-cases/user/createUserUseCase";
import { LoginUserUseCase } from "../../application/use-cases/user/LoginUserUseCase";
import { ChangePasswordUseCase } from "../../application/use-cases/user/ChangePasswordUseCase";
 
const userRepository = new MongoUserRepository();
const loginUserUseCase = new LoginUserUseCase(userRepository);

const createUserUseCase = new CreateUserUseCase(userRepository);
const changePasswordUseCase = new ChangePasswordUseCase(userRepository);


export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const user = await createUserUseCase.execute(name, email, password);
    res.status(201).json({ id: user.id, name: user.name, email: user.email });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};


export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const { token, user } = await loginUserUseCase.execute(email, password);

    // Crear un objeto sin el password
    const { password: _, ...userWithoutPassword } = user;

    res.json({ message: "Login exitoso", token, user: userWithoutPassword });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const changePassword = async (req: Request & { userId?: string }, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.userId; // viene del middleware de auth

    if (!userId) {
      res.status(401).json({ message: "No autorizado" });
      return;
    }

    await changePasswordUseCase.execute(userId, currentPassword, newPassword);

    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};


