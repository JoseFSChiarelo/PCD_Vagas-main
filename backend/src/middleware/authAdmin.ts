import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AdminTokenPayload } from '../types/jwt';

export function authAdmin(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'Token ausente' });
  const token = header.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, env.jwtSecret) as AdminTokenPayload;
    if (payload.type !== 'admin') return res.status(403).json({ error: 'Token inválido' });
    (req as any).admin = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido' });
  }
}
