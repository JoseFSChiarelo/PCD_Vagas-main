import { Router } from 'express';
import { vagaController } from '../controllers/vaga.controller';
import { authCompany } from '../middleware/authCompany';
import { authUser } from '../middleware/authUser';

export const vagaRouter = Router();
// públicas
vagaRouter.get('/', vagaController.listarPublicas);
vagaRouter.get('/:id', vagaController.detalhar);
// empresa
vagaRouter.post('/', authCompany, vagaController.publicar);
vagaRouter.put('/:id', authCompany, vagaController.editar);
vagaRouter.post('/:id/desativar', authCompany, vagaController.desativar);
vagaRouter.get('/empresa/minhas', authCompany, vagaController.listarEmpresa);