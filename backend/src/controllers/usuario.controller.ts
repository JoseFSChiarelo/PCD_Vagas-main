import { Request, Response } from 'express';
import { usuarioService } from '../services/usuario.service';
import { createUsuarioSchema, updateUsuarioSchema } from '../dtos/usuario.dto';

export const usuarioController = {
  cadastrar: async (req: Request, res: Response) => {
    const parsed = createUsuarioSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const user = await usuarioService.cadastrar(parsed.data);
    res.status(201).json({ id: user.id_usuario });
  },
  editar: async (req: Request, res: Response) => {
    const parsed = updateUsuarioSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const id = (req as any).user.id;
    const updated = await usuarioService.editar(id, parsed.data);
    res.json({ ok: true, updated });
  },
  perfil: async (req: Request, res: Response) => {
    const id = (req as any).user.id;
    const u = await usuarioService.obter(id);
    res.json(u);
  },
};