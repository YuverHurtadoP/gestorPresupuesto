import { Request, Response } from "express";
import { CreateUserUseCase } from "../application/use-cases/createUserUseCase";
import { MongoUserRepository } from "../infrastructure/repositories/MongoUserRepository";
import { LoginUserUseCase } from "../application/use-cases/LoginUserUseCase";
 
const userRepository = new MongoUserRepository();
const loginUserUseCase = new LoginUserUseCase(userRepository);

const createUserUseCase = new CreateUserUseCase(userRepository);

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


