import { Request, Response } from 'express';
import { adminService } from '../services/admin.service';

export const adminController = {
  criarDeficiencia: async (req: Request, res: Response) => {
    try {
      const { nome, descricao } = req.body || {};
      if (!nome) return res.status(400).json({ error: 'Nome é obrigatório' });
      const item = await adminService.salvarDeficiencia(nome, descricao);
      res.status(201).json(item);
    } catch (err: any) {
      res.status(err?.status || 500).json({ error: err?.message || 'Erro ao salvar deficiência' });
    }
  },
  criarBarreira: async (req: Request, res: Response) => {
    try {
      const { nome, descricao, deficienciaId } = req.body || {};
      if (!nome) return res.status(400).json({ error: 'Nome é obrigatório' });
      const item = await adminService.salvarBarreira(nome, descricao, deficienciaId);
      res.status(201).json(item);
    } catch (err: any) {
      res.status(err?.status || 500).json({ error: err?.message || 'Erro ao salvar barreira' });
    }
  },
  criarSubtipoBarreira: async (req: Request, res: Response) => {
    try {
      const { nome, descricao, barreiraId } = req.body || {};
      if (!nome) return res.status(400).json({ error: 'Nome é obrigatório' });
      const item = await adminService.salvarSubtipoBarreira(nome, descricao, barreiraId);
      res.status(201).json(item);
    } catch (err: any) {
      res.status(err?.status || 500).json({ error: err?.message || 'Erro ao salvar subtipo de barreira' });
    }
  },
  criarAcessibilidade: async (req: Request, res: Response) => {
    try {
      const { nome, descricao } = req.body || {};
      if (!nome) return res.status(400).json({ error: 'Nome é obrigatório' });
      const item = await adminService.salvarAcessibilidade(nome, descricao);
      res.status(201).json(item);
    } catch (err: any) {
      res.status(err?.status || 500).json({ error: err?.message || 'Erro ao salvar acessibilidade' });
    }
  },
  criarSubtipoAcessibilidade: async (req: Request, res: Response) => {
    try {
      const { nome, descricao, acessibilidadeId } = req.body || {};
      if (!nome) return res.status(400).json({ error: 'Nome é obrigatório' });
      const item = await adminService.salvarSubtipoAcessibilidade(nome, descricao, acessibilidadeId);
      res.status(201).json(item);
    } catch (err: any) {
      res.status(err?.status || 500).json({ error: err?.message || 'Erro ao salvar subtipo de acessibilidade' });
    }
  },
  empresasPendentes: async (_req: Request, res: Response) => {
    try {
      const empresas = await adminService.listarEmpresasPendentes();
      res.json(empresas);
    } catch (err: any) {
      res.status(err?.status || 500).json({ error: err?.message || 'Erro ao listar empresas' });
    }
  },
  aprovarEmpresa: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
      const empresa = await adminService.aprovarEmpresa(id);
      res.json({ ok: true, empresa });
    } catch (err: any) {
      res.status(err?.status || 500).json({ error: err?.message || 'Erro ao aprovar empresa' });
    }
  },
  catalogo: async (_req: Request, res: Response) => {
    try {
      const grouped = await adminService.listarHierarquia();
      res.json(grouped);
    } catch (err: any) {
      res.status(err?.status || 500).json({ error: err?.message || 'Erro ao listar catálogo' });
    }
  },
};
