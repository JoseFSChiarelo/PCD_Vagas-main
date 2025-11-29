import { Router } from 'express';
import { usuarioController } from '../controllers/usuario.controller';
import { authUser } from '../middleware/authUser';

export const usuarioRouter = Router();
usuarioRouter.post('/', usuarioController.cadastrar);
usuarioRouter.put('/me', authUser, usuarioController.editar);
usuarioRouter.get('/me', authUser, usuarioController.perfil);