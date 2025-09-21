import mongoose, { Schema, Document, Types } from "mongoose";

export interface IExpense extends Document {
  nombre: string;
  descripcion?: string;
  valor: number;
  presupuesto: Types.ObjectId; // referencia a Budget
  user: Types.ObjectId;        // referencia al propietario (User)
  createdAt?: Date;
  updatedAt?: Date;
}

const ExpenseSchema: Schema<IExpense> = new Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre del gasto es obligatorio"],
      trim: true,
    },
    descripcion: {
      type: String,
      default: "",
      trim: true,
    },
    valor: {
      type: Number,
      required: [true, "El valor del gasto es obligatorio"],
      min: [0, "El valor debe ser igual o mayor a 0"],
    },
    presupuesto: {
      type: Schema.Types.ObjectId,
      ref: "Budget",
      required: [true, "El gasto debe estar asociado a un presupuesto"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "El gasto debe estar asociado a un usuario"],
    },
  },
  { timestamps: true }
);

export default mongoose.model<IExpense>("Expense", ExpenseSchema);
