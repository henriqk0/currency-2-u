import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface TokenPayload {
    id: string;
    iat: number;
    exp: number;
}

export function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ error: 'Token not provided' });
    }

    const [, token] = authorization.split(' ');

    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT Secret not found');
        }

        const data = jwt.verify(token!, secret);
        const { id } = data as unknown as TokenPayload;

        req.userId = id;

        return next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}