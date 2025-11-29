import express from 'express';
import cors from 'cors';
import { authRouter } from './routes/auth.routes';
import { usuarioRouter } from './routes/usuario.routes';
import { empresaRouter } from './routes/empresa.routes';
import { vagaRouter } from './routes/vaga.routes';
import { candidaturaRouter } from './routes/candidatura.routes';
import { errorHandler } from './middleware/errorHandler';

export const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRouter);
app.use('/usuarios', usuarioRouter);
app.use('/empresas', empresaRouter);
app.use('/vagas', vagaRouter);
app.use('/candidaturas', candidaturaRouter);

app.use(errorHandler);