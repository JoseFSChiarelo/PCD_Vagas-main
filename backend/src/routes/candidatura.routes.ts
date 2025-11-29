import { Router } from 'express';
import { candidaturaController } from '../controllers/candidatura.controller';
import { authUser } from '../middleware/authUser';
import { authCompany } from '../middleware/authCompany';

export const candidaturaRouter = Router();
candidaturaRouter.post('/', authUser, candidaturaController.candidatar);
candidaturaRouter.get('/vaga/:id', authCompany, candidaturaController.candidatosDaVaga);