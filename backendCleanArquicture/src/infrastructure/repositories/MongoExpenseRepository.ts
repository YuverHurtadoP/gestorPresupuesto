import { IExpenseRepository } from "../../domain/repositories/IExpenseRepository";
import { Expense } from "../../domain/entities/Expense";
import ExpenseModel from "../models/ExpenseModel";
import BudgetModel from "../models/BudgetModel";
import { ExpenseMapper } from "../mappers/ExpenseMapper";
import { Types } from "mongoose";

export class MongoExpenseRepository implements IExpenseRepository {
  async save(expense: Expense): Promise<Expense> {
    console.log('expense',expense)
    const budgetDoc = await BudgetModel.findOne({
      _id: new Types.ObjectId(expense.presupuestoId),
      userId: new Types.ObjectId(expense.userId),
    });
    if (!budgetDoc) throw new Error("Presupuesto no encontrado o no autorizado");

    // sumar gastos existentes (mismo presupuesto)
    const gastos = await ExpenseModel.find({
      presupuesto: new Types.ObjectId(expense.presupuestoId),
    });
    const totalGastado = gastos.reduce((s, g) => s + (g.valor ?? 0), 0);
    if (totalGastado + expense.valor > budgetDoc.valor) {
      throw new Error("El gasto excede el presupuesto disponible");
    }

    const doc = new ExpenseModel(ExpenseMapper.toPersistence(expense));
    const saved = await doc.save();
    return ExpenseMapper.toDomain(saved);
  }

  async update(expense: Expense): Promise<Expense> {
    console.log('expense',expense)
    const existing = await ExpenseModel.findOne({
      _id: new Types.ObjectId(expense.id!),
      user: new Types.ObjectId(expense.userId),
    });
    if (!existing) throw new Error("Gasto no encontrado o no autorizado");

    const budgetDoc = await BudgetModel.findOne({
      _id: existing.presupuesto,
      userId: new Types.ObjectId(expense.userId),
    });
    if (!budgetDoc) throw new Error("Presupuesto no encontrado o no autorizado");

    // sumar todos los gastos excepto este
    const gastos = await ExpenseModel.find({
      presupuesto: existing.presupuesto,
      _id: { $ne: existing._id },
    });
    const totalGastado = gastos.reduce((s, g) => s + (g.valor ?? 0), 0);
    const nuevoValor = expense.valor ?? existing.valor;
    if (totalGastado + nuevoValor > budgetDoc.valor) {
      throw new Error("La actualización excede el presupuesto disponible");
    }

    // actualizar campos (en el documento de mongoose)
    existing.nombre = expense.nombre ?? existing.nombre;
    existing.descripcion = expense.descripcion ?? existing.descripcion;
    existing.valor = expense.valor ?? existing.valor;

    const updated = await existing.save();
    return ExpenseMapper.toDomain(updated);
  }

  async delete(id: string, userId: string): Promise<void> {
    const expense = await ExpenseModel.findOne({
      _id: new Types.ObjectId(id),
      user: new Types.ObjectId(userId),
    });
    if (!expense) throw new Error("Gasto no encontrado o no autorizado");

    const budgetDoc = await BudgetModel.findOne({
      _id: expense.presupuesto,
      userId: new Types.ObjectId(userId),
    });
    if (!budgetDoc) throw new Error("Presupuesto no encontrado o no autorizado");

    await ExpenseModel.deleteOne({ _id: expense._id });
  }

  async findById(id: string, userId: string): Promise<Expense | null> {
    const doc = await ExpenseModel.findOne({
      _id: new Types.ObjectId(id),
      user: new Types.ObjectId(userId),
    });
    if (!doc) return null;
    return ExpenseMapper.toDomain(doc);
  }

  async findByBudget(
    budgetId: string,
    userId: string,
    page: number,
    limit: number,
    search?: string
  ) {
    // validar presupuesto y autoría
    const budgetDoc = await BudgetModel.findOne({
      _id: new Types.ObjectId(budgetId),
      userId: new Types.ObjectId(userId),
    });
    if (!budgetDoc) throw new Error("Presupuesto no encontrado o no autorizado");

    const query: any = {
      presupuesto: new Types.ObjectId(budgetId),
      user: new Types.ObjectId(userId),
    };
    if (search) query.nombre = { $regex: search, $options: "i" };

    const docs = await ExpenseModel.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await ExpenseModel.countDocuments(query);

    return {
      expenses: docs.map(ExpenseMapper.toDomain),
      total,
    };
  }

  async getSummaryByBudget(budgetId: string, userId: string) {
    const budgetDoc = await BudgetModel.findOne({
      _id: new Types.ObjectId(budgetId),
      userId: new Types.ObjectId(userId),
    });
    if (!budgetDoc) throw new Error("Presupuesto no encontrado o no autorizado");

    const expenses = await ExpenseModel.find({
      presupuesto: new Types.ObjectId(budgetId),
      user: new Types.ObjectId(userId),
    });

    if (!expenses.length) {
      return {
        presupuesto: budgetDoc.valor,
        gastado: 0,
        disponible: budgetDoc.valor,
        porcentaje: 0,
        detalle: [],
      };
    }

    const gastado = expenses.reduce((s, g) => s + (g.valor ?? 0), 0);
    const disponible = budgetDoc.valor - gastado;
    const porcentaje = budgetDoc.valor > 0 ? (gastado / budgetDoc.valor) * 100 : 0;

    const agrupados = expenses.reduce((acc: any, g) => {
      acc[g.nombre] = (acc[g.nombre] || 0) + g.valor;
      return acc;
    }, {});

    const detalle = Object.keys(agrupados).map((nombre) => ({
      nombre,
      total: agrupados[nombre],
      porcentaje: Number(((agrupados[nombre] / gastado) * 100).toFixed(2)),
    }));

    return {
      presupuesto: budgetDoc.valor,
      gastado,
      disponible,
      porcentaje: Number(porcentaje.toFixed(2)),
      detalle,
    };
  }
}
