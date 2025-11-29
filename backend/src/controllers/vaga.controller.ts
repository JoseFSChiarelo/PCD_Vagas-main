import { Request, Response } from 'express';
import { vagaService } from '../services/vaga.service';
import { createVagaSchema, updateVagaSchema } from '../dtos/vaga.dto';

export const vagaController = {
  publicar: async (req: Request, res: Response) => {
    const parsed = createVagaSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const empresaId = (req as any).company.id;
    const vaga = await vagaService.publicar(empresaId, parsed.data);
    res.status(201).json(vaga);
  },
  editar: async (req: Request, res: Response) => {
    const parsed = updateVagaSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const vaga = await vagaService.editar(Number(req.params.id), parsed.data);
    res.json(vaga);
  },
  desativar: async (req: Request, res: Response) => {
    const vaga = await vagaService.desativar(Number(req.params.id));
    res.json(vaga);
  },
  listarPublicas: async (_req: Request, res: Response) => {
    const vagas = await vagaService.listarPublicas();
    res.json(vagas);
  },
  detalhar: async (req: Request, res: Response) => {
    const vaga = await vagaService.detalhar(Number(req.params.id));
    if (!vaga || vaga.status !== 'ATIVO') return res.status(404).json({ error: 'Vaga não encontrada' });
    res.json(vaga);
  },
  listarEmpresa: async (req: Request, res: Response) => {
    const empresaId = (req as any).company.id;
    const vagas = await vagaService.listarEmpresa(empresaId);
    res.json(vagas);
  },
};