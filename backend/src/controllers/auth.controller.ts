import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { loginUsuarioSchema, loginEmpresaSchema } from '../dtos/auth.dto';

export const authController = {
  loginUsuario: async (req: Request, res: Response) => {
    const parsed = loginUsuarioSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const result = await authService.loginUsuario(parsed.data.email, parsed.data.senha);
    res.json(result);
  },
  loginEmpresa: async (req: Request, res: Response) => {
    const parsed = loginEmpresaSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const result = await authService.loginEmpresa(parsed.data.email, parsed.data.senha);
    res.json(result);
  },
};