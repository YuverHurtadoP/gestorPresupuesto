import { Budget } from "../../domain/entities/Budget";
import { Types } from "mongoose";

export class BudgetMapper {
  static toPersistence(budget: Budget) {
    return {
      nombre: budget.nombre,
      descripcion: budget.descripcion,
      valor: budget.valor,
      userId: new Types.ObjectId(budget.userId),
    };
  }

  static toDomain(doc: any): Budget {
    return new Budget(
      doc.nombre,
      doc.valor,
      doc.userId.toString(),
      doc.descripcion,
      doc._id.toString(),
      doc.createdAt,
      doc.updatedAt
    );
  }
}
