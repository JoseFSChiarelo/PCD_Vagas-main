import { Router } from 'express';
import { adminController } from '../controllers/admin.controller';
import { authAdmin } from '../middleware/authAdmin';

export const adminRouter = Router();

// Taxonomias e catálogos
adminRouter.post('/deficiencias', authAdmin, adminController.criarDeficiencia);
adminRouter.post('/barreiras', authAdmin, adminController.criarBarreira);
adminRouter.post('/barreiras/subtipos', authAdmin, adminController.criarSubtipoBarreira);
adminRouter.post('/acessibilidades', authAdmin, adminController.criarAcessibilidade);
adminRouter.post('/acessibilidades/subtipos', authAdmin, adminController.criarSubtipoAcessibilidade);

// Empresas
adminRouter.get('/empresas/pendentes', authAdmin, adminController.empresasPendentes);
adminRouter.post('/empresas/:id/aprovar', authAdmin, adminController.aprovarEmpresa);

// Catálogo (consulta)
adminRouter.get('/catalogo', authAdmin, adminController.catalogo);
