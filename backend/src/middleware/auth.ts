// backend/src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const JWT_SECRET = process.env.JWT_SECRET || 'ev_charging_secret_key_2024';
export const JWT_EXPIRES_IN = '7d';

export interface JwtPayload {
    userId: string;
    email: string;
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        res.status(401).json({ error: 'No token provided' });
        return;
    }
    const token = header.slice(7);
    try {
        const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
        (req as Request & { user: JwtPayload }).user = payload;
        next();
    } catch {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
}
