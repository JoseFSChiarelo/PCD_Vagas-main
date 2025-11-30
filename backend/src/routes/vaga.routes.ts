import { Router } from 'express';
import { vagaController } from '../controllers/vaga.controller';
import { authCompany } from '../middleware/authCompany';
import { authUser } from '../middleware/authUser';

export const vagaRouter = Router();
// rotas publicas
vagaRouter.get('/', vagaController.listarPublicas);
// candidato
vagaRouter.get('/compativeis', authUser, vagaController.listarCompativeis);
// empresa
vagaRouter.get('/empresa/minhas', authCompany, vagaController.listarEmpresa);
vagaRouter.post('/', authCompany, vagaController.publicar);
vagaRouter.put('/:id', authCompany, vagaController.editar);
vagaRouter.post('/:id/desativar', authCompany, vagaController.desativar);
// detalhe publico deve ficar por ultimo para nao interceptar rotas anteriores
vagaRouter.get('/:id', vagaController.detalhar);
