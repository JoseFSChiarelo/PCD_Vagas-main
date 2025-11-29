import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { UserTokenPayload } from '../types/jwt';

export function authUser(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'Token ausente' });
  const token = header.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, env.jwtSecret) as UserTokenPayload;
    if (payload.type !== 'usuario') return res.status(403).json({ error: 'Token inválido' });
    (req as any).user = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido' });
  }
}