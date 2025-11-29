import { Request, Response } from 'express';
import { empresaService } from '../services/empresa.service';
import { createEmpresaSchema, updateEmpresaSchema } from '../dtos/empresa.dto';

export const empresaController = {
  cadastrar: async (req: Request, res: Response) => {
    const parsed = createEmpresaSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const e = await empresaService.cadastrar(parsed.data);
    res.status(201).json({ id: e.id_empresa });
  },
  editar: async (req: Request, res: Response) => {
    const parsed = updateEmpresaSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const id = (req as any).company.id;
    const updated = await empresaService.editar(id, parsed.data);
    res.json({ ok: true, updated });
  },
  perfil: async (req: Request, res: Response) => {
    const id = (req as any).company.id;
    const e = await empresaService.obter(id);
    res.json(e);
  },
};