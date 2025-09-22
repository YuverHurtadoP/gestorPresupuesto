import { User } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repositories/IUserRepositor";
import UserModel, { IUserDocument } from "../models/UserModel";

 
export class MongoUserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const userDoc: IUserDocument | null = await UserModel.findOne({ email });
    return userDoc ? this.toDomain(userDoc) : null;
  }

  async save(user: User): Promise<User> {
    const userDoc = new UserModel({
      nombre: user.name,
      email: user.email,
      password: user.password,
    });
    await userDoc.save();
    return this.toDomain(userDoc);
  }

  private toDomain(userDoc: IUserDocument): User {
    return new User(
      userDoc._id.toString(),
      userDoc.nombre,
      userDoc.email,
      userDoc.password,
      userDoc.createdAt,
      userDoc.updatedAt
    );
  }
 
}
