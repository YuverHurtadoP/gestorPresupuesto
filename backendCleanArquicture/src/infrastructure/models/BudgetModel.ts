import mongoose, { Schema, Document, Types } from "mongoose";

export interface IBudgetDocument extends Document {
  nombre: string;
  descripcion?: string;
  valor: number;
  user: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const BudgetSchema: Schema = new Schema(
  {
    nombre: { type: String, required: true, trim: true },
    descripcion: { type: String, default: "", trim: true },
    valor: { type: Number, required: true, min: 0 },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const BudgetModel = mongoose.model<IBudgetDocument>("Budget", BudgetSchema);

export default BudgetModel;
