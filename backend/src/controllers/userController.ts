import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, nombre } = req.body;

    // Validar que no exista el email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "El correo ya está registrado" });
      return;
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      nombre,
    });

    await newUser.save();

    res.status(201).json({ message: "Usuario creado correctamente", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Usuario no encontrado" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Contraseña incorrecta" });
      return;
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    // Crear un objeto sin el password
    const { password: _, ...userWithoutPassword } = user.toObject();

    res.json({ message: "Login exitoso", token, user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error });
  }
};


export const updateUser = async (req: Request & { userId?: string }, res: Response): Promise<void> => {
  try {
    const { nombre, password } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }

    // Actualizar nombre si se envía
    if (nombre) {
      user.nombre = nombre;
    }

    // Actualizar contraseña si se envía
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();

    res.json({
      message: "Usuario actualizado correctamente",
      user: {
        id: user._id,
        email: user.email,
        nombre: user.nombre,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error });
  }
};