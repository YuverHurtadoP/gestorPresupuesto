import { User } from "../entities/User";

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  updatePassword(id: string, hashedPassword: string): Promise<void>;
}