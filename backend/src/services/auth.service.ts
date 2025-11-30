import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { usuarioRepo } from '../repositories/usuario.repository';
import { empresaRepo } from '../repositories/empresa.repository';
import { comparePassword, hashPassword } from '../utils/bcrypt';

export const authService = {
  loginUsuario: async (email: string, senha: string) => {
    const u = await usuarioRepo.findByEmail(email);
    if (!u) throw { status: 401, message: 'Credenciais invalidas' };

    let ok = await comparePassword(senha, u.senha);

    // Fallback para contas legadas com senha salva em texto puro; migra para hash seguro
    if (!ok && u.senha === senha) {
      const novoHash = await hashPassword(senha);
      await usuarioRepo.update(u.id_usuario, { senha: novoHash });
      ok = true;
    }

    if (!ok) throw { status: 401, message: 'Credenciais invalidas' };
    const token = jwt.sign({ type: 'usuario', id: u.id_usuario, nome: u.nome }, env.jwtSecret, { expiresIn: '7d' });
    return { token, usuario: { id: u.id_usuario, nome: u.nome, email: u.email } };
  },

  loginEmpresa: async (email: string, senha: string) => {
    const e = await empresaRepo.findByEmail(email);
    if (!e) throw { status: 401, message: 'Credenciais invalidas' };
    const ok = await comparePassword(senha, e.senha);
    if (!ok) throw { status: 401, message: 'Credenciais invalidas' };
    if (!e.aprovada) throw { status: 403, message: 'Empresa aguardando aprovacao' };
    const token = jwt.sign({ type: 'empresa', id: e.id_empresa, nome: e.nome }, env.jwtSecret, { expiresIn: '7d' });
    return { token, empresa: { id: e.id_empresa, nome: e.nome, email: e.email } };
  },

  loginAdmin: async (email: string, senha: string) => {
    const validEmail = email === env.adminEmail;
    const validSenha = senha === env.adminSenha;
    if (!validEmail || !validSenha) throw { status: 401, message: 'Credenciais invalidas' };
    const token = jwt.sign({ type: 'admin', email }, env.jwtSecret, { expiresIn: '7d' });
    return { token, admin: { email } };
  },
};
