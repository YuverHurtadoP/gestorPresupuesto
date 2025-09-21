import mongoose, { Schema, Document, Types } from "mongoose";

export interface IBudget extends Document {
  nombre: string;
  descripcion?: string;
  valor: number;
  user: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const BudgetSchema: Schema<IBudget> = new Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre del presupuesto es obligatorio"],
      trim: true,
    },
    descripcion: {
      type: String,
      default: "",
      trim: true,
    },
    valor: {
      type: Number,
      required: [true, "El valor del presupuesto es obligatorio"],
      min: [0, "El valor debe ser igual o mayor a 0"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "El presupuesto debe estar asociado a un usuario"],
    },
  },
  { timestamps: true }
);

export default mongoose.model<IBudget>("Budget", BudgetSchema);
