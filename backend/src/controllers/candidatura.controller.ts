import { Request, Response } from 'express';
import { candidaturaService } from '../services/candidatura.service';
import { candidaturaSchema } from '../dtos/candidatura.dto';

export const candidaturaController = {
  candidatar: async (req: Request, res: Response) => {
    const parsed = candidaturaSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const id_usuario = (req as any).user.id;
    const c = await candidaturaService.candidatar(parsed.data.id_vaga, id_usuario);
    res.status(201).json(c);
  },
  candidatosDaVaga: async (req: Request, res: Response) => {
    const id_vaga = Number(req.params.id);
    const lista = await candidaturaService.listarCandidatosParaEmpresa(id_vaga);
    res.json(lista);
  },
};