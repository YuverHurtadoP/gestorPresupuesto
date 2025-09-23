import { User } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repositories/IUserRepositor";
import UserModel, { IUserDocument } from "../models/UserModel";
import {UserMapper} from "../mappers/UserMapper";
 
export class MongoUserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    const userDoc: IUserDocument | null = await UserModel.findById(id);
    return userDoc ? UserMapper.toDomain(userDoc) : null;
  }

  async updatePassword(id: string, hashedPassword: string): Promise<void> {
    await UserModel.findByIdAndUpdate(id, { password: hashedPassword });
  }

  async findByEmail(email: string): Promise<User | null> {
    const userDoc: IUserDocument | null = await UserModel.findOne({ email });
    return userDoc ? UserMapper.toDomain(userDoc) : null;
  }

  async save(user: User): Promise<User> {
    const userDoc = new UserModel({
      nombre: user.name,
      email: user.email,
      password: user.password,
    });
    await userDoc.save();
    return UserMapper.toDomain(userDoc);
  }

 
}
