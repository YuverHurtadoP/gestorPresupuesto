import { Schema, model, Document, Types } from "mongoose";

export interface IBudgetDocument extends Document {
  nombre: string;
  descripcion?: string;
  valor: number;
  userId: Types.ObjectId;   
  createdAt: Date;
  updatedAt: Date;
}

const BudgetSchema = new Schema<IBudgetDocument>(
  {
    nombre: { type: String, required: true },
    descripcion: { type: String },
    valor: { type: Number, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // 👈 correcto
  },
  { timestamps: true }
);

export default model<IBudgetDocument>("Budget", BudgetSchema);
