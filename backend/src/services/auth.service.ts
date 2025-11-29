import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { usuarioRepo } from '../repositories/usuario.repository';
import { empresaRepo } from '../repositories/empresa.repository';
import { comparePassword } from '../utils/bcrypt';

export const authService = {
  loginUsuario: async (email: string, senha: string) => {
    const u = await usuarioRepo.findByEmail(email);
    if (!u) throw { status: 401, message: 'Credenciais inválidas' };
    const ok = await comparePassword(senha, u.senha);
    if (!ok) throw { status: 401, message: 'Credenciais inválidas' };
    const token = jwt.sign({ type: 'usuario', id: u.id_usuario, nome: u.nome }, env.jwtSecret, { expiresIn: '7d' });
    return { token, usuario: { id: u.id_usuario, nome: u.nome, email: u.email } };
  },
  loginEmpresa: async (email: string, senha: string) => {
    const e = await empresaRepo.findByEmail(email);
    if (!e) throw { status: 401, message: 'Credenciais inválidas' };
    const ok = await comparePassword(senha, e.senha);
    if (!ok) throw { status: 401, message: 'Credenciais inválidas' };
    if (!e.aprovada) throw { status: 403, message: 'Empresa aguardando aprovação' };
    const token = jwt.sign({ type: 'empresa', id: e.id_empresa, nome: e.nome }, env.jwtSecret, { expiresIn: '7d' });
    return { token, empresa: { id: e.id_empresa, nome: e.nome, email: e.email } };
  },
  loginAdmin: async (email: string, senha: string) => {
    const validEmail = email === env.adminEmail;
    const validSenha = senha === env.adminSenha;
    if (!validEmail || !validSenha) throw { status: 401, message: 'Credenciais inválidas' };
    const token = jwt.sign({ type: 'admin', email }, env.jwtSecret, { expiresIn: '7d' });
    return { token, admin: { email } };
  },
};
