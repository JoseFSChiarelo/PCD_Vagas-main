import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { loginUsuarioSchema, loginEmpresaSchema, loginAdminSchema } from '../dtos/auth.dto';

export const authController = {
  loginUsuario: async (req: Request, res: Response) => {
    try {
      const parsed = loginUsuarioSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
      const result = await authService.loginUsuario(parsed.data.email, parsed.data.senha);
      res.json(result);
    } catch (err: any) {
      const status = err.status || 500;
      res.status(status).json({ error: err.message || 'Erro ao logar usuário' });
    }
  },
  loginEmpresa: async (req: Request, res: Response) => {
    try {
      const parsed = loginEmpresaSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
      const result = await authService.loginEmpresa(parsed.data.email, parsed.data.senha);
      res.json(result);
    } catch (err: any) {
      const status = err.status || 500;
      res.status(status).json({ error: err.message || 'Erro ao logar empresa' });
    }
  },
  loginAdmin: async (req: Request, res: Response) => {
    try {
      const parsed = loginAdminSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
      const result = await authService.loginAdmin(parsed.data.email, parsed.data.senha);
      res.json(result);
    } catch (err: any) {
      const status = err.status || 500;
      res.status(status).json({ error: err.message || 'Erro ao logar admin' });
    }
  },
};
