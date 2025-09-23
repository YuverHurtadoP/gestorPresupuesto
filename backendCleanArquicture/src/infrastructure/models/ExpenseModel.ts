import { Schema, model, Document, Types } from "mongoose";

export interface IExpenseDocument extends Document {
  nombre: string;
  descripcion?: string;
  valor: number;
  presupuesto: Types.ObjectId; // coincide con Schema.Types.ObjectId
  user: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema = new Schema<IExpenseDocument>(
  {
    nombre: { type: String, required: true },
    descripcion: { type: String },
    valor: { type: Number, required: true },
    presupuesto: { type: Schema.Types.ObjectId, ref: "Budget", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default model<IExpenseDocument>("Expense", ExpenseSchema);
