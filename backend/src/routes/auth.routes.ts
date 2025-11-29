import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
export const authRouter = Router();
authRouter.post('/usuario/login', authController.loginUsuario);
authRouter.post('/empresa/login', authController.loginEmpresa);