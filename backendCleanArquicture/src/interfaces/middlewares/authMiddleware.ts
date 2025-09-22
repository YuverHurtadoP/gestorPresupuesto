import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  id: string;
}

export const authMiddleware = (
  req: Request & { userId?: string },
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Acceso denegado. Token no proporcionado." });
    return;
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    // Guardamos el ID del usuario en el request para usarlo después
    req.userId = decoded.id;

    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido o expirado." });
  }
};
