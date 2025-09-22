import { Request, Response } from "express";
import Expense from "../models/Expense";
import Budget from "../models/Budget";

// HU8 - Crear gasto con validación de presupuesto
export const createExpense = async (req: Request & { userId?: string }, res: Response): Promise<void> => {
  try {
    const { nombre, descripcion, valor, presupuestoId } = req.body;

    if (!nombre || valor === undefined || !presupuestoId) {
      res.status(400).json({ message: "nombre, valor y presupuestoId son obligatorios" });
      return;
    }

    // Verificar presupuesto
    const budget = await Budget.findOne({ _id: presupuestoId, user: req.userId });
    if (!budget) {
      res.status(404).json({ message: "Presupuesto no encontrado o no autorizado" });
      return;
    }

    // Sumar gastos existentes
    const gastos = await Expense.find({ presupuesto: presupuestoId });
    const totalGastado = gastos.reduce((sum, g) => sum + g.valor, 0);

    if (totalGastado + valor > budget.valor) {
      res.status(400).json({
        message: "El gasto excede el presupuesto disponible",
        presupuesto: budget.valor,
        gastado: totalGastado,
        disponible: budget.valor - totalGastado,
      });
      return;
    }

    const newExpense = new Expense({
      nombre,
      descripcion,
      valor,
      presupuesto: presupuestoId,
      user: req.userId,
    });

    await newExpense.save();

    res.status(201).json({ message: "Gasto creado correctamente", expense: newExpense });
  } catch (error) {
    res.status(500).json({ message: "Error al crear el gasto", error });
  }
};

// HU10 - Editar gasto con validación de presupuesto
export const updateExpense = async (req: Request & { userId?: string }, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, valor } = req.body;

    // Buscar gasto
    const expense = await Expense.findOne({ _id: id, user: req.userId });
    if (!expense) {
      res.status(404).json({ message: "Gasto no encontrado o no autorizado" });
      return;
    }

    // Obtener presupuesto
    const budget = await Budget.findOne({ _id: expense.presupuesto, user: req.userId });
    if (!budget) {
      res.status(404).json({ message: "Presupuesto no encontrado o no autorizado" });
      return;
    }

    // Sumar todos los gastos EXCEPTO este
    const gastos = await Expense.find({ presupuesto: expense.presupuesto, _id: { $ne: expense._id } });
    const totalGastado = gastos.reduce((sum, g) => sum + g.valor, 0);

    const nuevoValor = valor ?? expense.valor;
    if (totalGastado + nuevoValor > budget.valor) {
      res.status(400).json({
        message: "La actualización excede el presupuesto disponible",
        presupuesto: budget.valor,
        gastado: totalGastado,
        disponible: budget.valor - totalGastado,
      });
      return;
    }

    // Actualizar campos
    expense.nombre = nombre ?? expense.nombre;
    expense.descripcion = descripcion ?? expense.descripcion;
    expense.valor = nuevoValor;

    await expense.save();

    res.status(200).json({ message: "Gasto actualizado correctamente", expense });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el gasto", error });
  }
  
};

//GET http://localhost:4000/api/expenses/66fa1b5d12345abcd6789ef0?page=1&limit=5&search=hotel

export const getExpensesByBudget = async (
  req: Request & { userId?: string },
  res: Response
): Promise<void> => {
  try {
    const { presupuestoId } = req.params;
    const { page = 1, limit = 10, search = "" } = req.query;

    // Verificar que el presupuesto exista y pertenezca al usuario
    const budget = await Budget.findOne({ _id: presupuestoId, user: req.userId });
    if (!budget) {
      res.status(404).json({ message: "Presupuesto no encontrado o no autorizado" });
      return;
    }

    // Buscar los gastos con paginación y filtro por nombre
    const expenses = await Expense.find({
      presupuesto: presupuestoId,
      nombre: { $regex: search as string, $options: "i" },
    })
      .skip((+page - 1) * +limit)
      .limit(+limit)
      .sort({ createdAt: -1 });

    const total = await Expense.countDocuments({
      presupuesto: presupuestoId,
      nombre: { $regex: search as string, $options: "i" },
    });

    res.status(200).json({
      message: "Gastos obtenidos correctamente",
      expenses,
      total,
      page: +page,
      limit: +limit,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los gastos", error });
  }
};

// HU11 - Eliminar gasto con validación de presupuesto
export const deleteExpense = async (req: Request & { userId?: string }, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Buscar gasto
    const expense = await Expense.findOne({ _id: id, user: req.userId });
    if (!expense) {
      res.status(404).json({ message: "Gasto no encontrado o no autorizado" });
      return;
    }

    // Verificar presupuesto asociado
    const budget = await Budget.findOne({ _id: expense.presupuesto, user: req.userId });
    if (!budget) {
      res.status(404).json({ message: "Presupuesto no encontrado o no autorizado" });
      return;
    }

    // Eliminar el gasto
    await expense.deleteOne();

    res.status(200).json({
      message: "Gasto eliminado correctamente",
      expenseId: id
    });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el gasto", error });
  }
};

export const getExpensesSummaryByBudget = async (
  req: Request & { userId?: string },
  res: Response
): Promise<void> => {   // <--- aquí
  try {
    const { presupuestoId } = req.params;

    const budget = await Budget.findOne({ _id: presupuestoId, user: req.userId });
    if (!budget) {
      res.status(404).json({ message: "Presupuesto no encontrado o no autorizado" });
      return;
    }

    const expenses = await Expense.find({ presupuesto: presupuestoId, user: req.userId });

    if (!expenses.length) {
      res.status(200).json({
        presupuesto: budget.valor,
        gastado: 0,
        disponible: budget.valor,
        porcentaje: 0,
        detalle: []
      });
      return;
    }

    const gastado = expenses.reduce((sum, g) => sum + g.valor, 0);
    const disponible = budget.valor - gastado;
    const porcentaje = budget.valor > 0 ? (gastado / budget.valor) * 100 : 0;

    const agrupados = expenses.reduce((acc: any, g) => {
      acc[g.nombre] = (acc[g.nombre] || 0) + g.valor;
      return acc;
    }, {});

    const detalle = Object.keys(agrupados).map(nombre => ({
      nombre,
      total: agrupados[nombre],
      porcentaje: Number(((agrupados[nombre] / gastado) * 100).toFixed(2))
    }));

    res.status(200).json({
      presupuesto: budget.valor,
      gastado,
      disponible,
      porcentaje: Number(porcentaje.toFixed(2)),
      detalle
    });

  } catch (error) {
    res.status(500).json({ message: "Error al obtener resumen de gastos", error });
  }
};
