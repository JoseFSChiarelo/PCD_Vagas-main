import { Router } from 'express';
import { empresaController } from '../controllers/empresa.controller';
import { authCompany } from '../middleware/authCompany';

export const empresaRouter = Router();
empresaRouter.post('/', empresaController.cadastrar);
empresaRouter.put('/me', authCompany, empresaController.editar);
empresaRouter.get('/me', authCompany, empresaController.perfil);