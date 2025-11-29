import { Router } from 'express';
import { adminService } from '../services/admin.service';

export const catalogoRouter = Router();

catalogoRouter.get('/', async (_req, res) => {
  try {
    const data = await adminService.listarHierarquia();
    res.json(data);
  } catch (err: any) {
    res.status(err?.status || 500).json({ error: err?.message || 'Erro ao listar catálogo' });
  }
});
