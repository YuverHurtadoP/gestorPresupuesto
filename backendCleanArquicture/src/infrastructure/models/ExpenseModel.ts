import mongoose, { Schema, Document, Types } from "mongoose";

export interface IExpenseDocument extends Document {
  nombre: string;
  descripcion?: string;
  valor: number;
  presupuesto: Types.ObjectId; // referencia a Budget
  user: Types.ObjectId;        // referencia a User
  createdAt?: Date;
  updatedAt?: Date;
}

const ExpenseSchema: Schema = new Schema(
  {
    nombre: { type: String, required: true, trim: true },
    descripcion: { type: String, default: "", trim: true },
    valor: { type: Number, required: true, min: 0 },
    presupuesto: { type: Schema.Types.ObjectId, ref: "Budget", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const ExpenseModel = mongoose.model<IExpenseDocument>("Expense", ExpenseSchema);

export default ExpenseModel;
