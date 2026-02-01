import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
    };
}

class AuthMiddleware {
    public authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return res.status(401).json({ message: "No token provided" });
            }

            const token = authHeader.split(" ")[1];
            const secret = process.env.JWT_SECRET || "default_secret";

            const decoded = jwt.verify(token, secret) as { id: string; email: string };

            req.user = decoded;
            next();
        } catch (err) {
            return res.status(401).json({ message: "Invalid token" });
        }
    };
}

export default AuthMiddleware;
