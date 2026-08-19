import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: number;
  role?: string;
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token as string, process.env.JWT_SECRET as string) as unknown as {
      userId: number;
      role: string;
    };

    req.userId = decoded.userId;
    req.role = decoded.role;

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}