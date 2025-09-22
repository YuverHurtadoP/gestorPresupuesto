
import { User } from "../../domain/entities/User";
 import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IUserRepository } from "../../domain/repositories/IUserRepositor";

export class LoginUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(email: string, password: string): Promise<{ token: string; user: User }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new Error("Usuario no encontrado");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Contraseña incorrecta");

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: "1d",
    });

    return { token, user };
  }
}
