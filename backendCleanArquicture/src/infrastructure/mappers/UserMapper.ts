import { User } from "../../domain/entities/User";
import { IUserDocument } from "../models/UserModel";



export class UserMapper {

    static toDomain(userDoc: IUserDocument): User {
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
