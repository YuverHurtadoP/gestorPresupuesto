import { IBudgetRepository } from "../../domain/repositories/IBudgetRepository";
import { Budget } from "../../domain/entities/Budget";
import BudgetModel from "../models/BudgetModel";
import { BudgetMapper } from "../mappers/BudgetMapper";
import { Types } from "mongoose";

export class MongoBudgetRepository implements IBudgetRepository {
  async save(budget: Budget): Promise<Budget> {
    const doc = new BudgetModel(BudgetMapper.toPersistence(budget));
    const saved = await doc.save();
    return BudgetMapper.toDomain(saved);
  }

  async findById(id: string, userId: string): Promise<Budget | null> {
    const doc = await BudgetModel.findOne({ 
      _id: id, 
      userId: new Types.ObjectId(userId) 
    });
    return doc ? BudgetMapper.toDomain(doc) : null;
  }

  async findAll(userId: string, page: number, limit: number, search?: string) {
    const query: any = { userId: new Types.ObjectId(userId) };
    if (search) query.nombre = { $regex: search, $options: "i" };

    const docs = await BudgetModel.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await BudgetModel.countDocuments({ userId: new Types.ObjectId(userId) });

    return {
      budgets: docs.map(BudgetMapper.toDomain),
      total,
    };
  }

  async update(budget: Budget): Promise<Budget> {
    const updated = await BudgetModel.findOneAndUpdate(
      { _id: budget.id, userId: new Types.ObjectId(budget.userId) },
      { $set: BudgetMapper.toPersistence(budget) },
      { new: true }
    );
    if (!updated) throw new Error("Presupuesto no encontrado");
    return BudgetMapper.toDomain(updated);
  }

  async delete(id: string, userId: string): Promise<void> {
    await BudgetModel.deleteOne({ 
      _id: id, 
      userId: new Types.ObjectId(userId) 
    });
  }
}
