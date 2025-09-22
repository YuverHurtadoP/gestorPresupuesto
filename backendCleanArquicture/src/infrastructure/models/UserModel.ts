 
import mongoose, { Schema, Document } from "mongoose";

export interface IUserDocument extends Document {
  nombre: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema: Schema = new Schema(
  {
    nombre: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 }
  },
  { timestamps: true }
);

const UserModel = mongoose.model<IUserDocument>("User", UserSchema);

export default UserModel;
