import { Request, Response } from "express";
import Budget from "../models/Budget";
import Expense from "../models/Expense";
export const createBudget = async (req: Request & { userId?: string }, res: Response): Promise<void> => {
  try {
    const { nombre, descripcion, valor } = req.body;

    if (!nombre || !valor) {
      res.status(400).json({ message: "El nombre y el valor son obligatorios" });
      return;
    }

    const newBudget = new Budget({
      nombre,
      descripcion,
      valor,
      user: req.userId,  
    });

    await newBudget.save();

    res.status(201).json({
      message: "Presupuesto creado correctamente",
      budget: newBudget,
    });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error });
  }
};

//http://localhost:4000/api/budgets?page=1&limit=5
export const getBudgets = async (req: Request & { userId?: string }, res: Response) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const budgets = await Budget.find({
      user: req.userId,
      nombre: { $regex: search as string, $options: "i" },
    })
      .skip((+page - 1) * +limit)
      .limit(+limit)
      .sort({ createdAt: -1 });

    const total = await Budget.countDocuments({ user: req.userId });

    res.status(200).json({
      budgets,
      total,
      page: +page,
      limit: +limit,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al listar presupuestos", error });
  }
};


export const updateBudget = async (
  req: Request & { userId?: string },
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, valor } = req.body;

    // Buscar el presupuesto
    const budget = await Budget.findOne({ _id: id, user: req.userId });
    if (!budget) {
      res.status(404).json({ message: "Presupuesto no encontrado o no autorizado" });
      return;
    }

    // Actualizar valores
    budget.nombre = nombre || budget.nombre;
    budget.descripcion = descripcion || budget.descripcion;
    budget.valor = valor || budget.valor;

    await budget.save();

    res.status(200).json({
      message: "Presupuesto actualizado correctamente",
      budget,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el presupuesto", error });
  }
};


export const deleteBudget = async (req: Request & { userId?: string }, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Buscar presupuesto que pertenezca al usuario
    const budget = await Budget.findOne({ _id: id, user: req.userId });
    if (!budget) {
      res.status(404).json({ message: "Presupuesto no encontrado o no autorizado" });
      return;
    }

    // Eliminar gastos asociados (cascade)
    await Expense.deleteMany({ presupuesto: budget._id });

    // Eliminar presupuesto
    await budget.deleteOne();

    res.status(200).json({ message: "Presupuesto y gastos asociados eliminados correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el presupuesto", error });
  }
};