import { Expense } from "../../domain/entities/Expense";
import { Types, Document } from "mongoose";

interface IExpenseDoc extends Document {
  nombre: string;
  descripcion?: string;
  valor: number;
  presupuesto: Types.ObjectId;
  user: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export class ExpenseMapper {
  static toPersistence(expense: Expense) {
    return {
      nombre: expense.nombre,
      descripcion: expense.descripcion,
      valor: expense.valor,
      // mongoose acepta string al crear, pero aquí lo hacemos explícito
      presupuesto: new Types.ObjectId(expense.presupuestoId),
      user: new Types.ObjectId(expense.userId),
    };
  }

  static toDomain(doc: IExpenseDoc): Expense {
    return new Expense(
      doc.nombre,
      doc.valor,
      doc.presupuesto.toString(), // -> presupuestoId (string) en dominio
      doc.user.toString(),        // -> userId (string) en dominio
      doc.descripcion,
      doc._id.toString(),
      doc.createdAt,
      doc.updatedAt
    );
  }
}
