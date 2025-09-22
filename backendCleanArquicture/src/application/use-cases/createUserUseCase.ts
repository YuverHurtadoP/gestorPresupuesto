import { User } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repositories/IUserRepositor";
import bcrypt from "bcrypt";
export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) { }

  async execute(name: string, email: string, password: string): Promise<User> {
    // Validar si el email ya existe
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("El email ya está registrado");
    }

    const hashedPassword = await bcrypt.hash(password, 10); // 10 salt rounds
    const newUser = new User(null, name, email, hashedPassword, new Date(), new Date());

    // Guardar usando el repositorio
    return this.userRepository.save(newUser);
  }
}
