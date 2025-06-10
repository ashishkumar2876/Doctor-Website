import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";

const JWT_SECRET = process.env.JWT_SECRET as string;

interface JwtPayload {
  id: string;
  role: string;
}
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}
export const protect = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
  const token = req.cookies.token; // ✅ Get token from cookies

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token failed or expired" });
  }
};
