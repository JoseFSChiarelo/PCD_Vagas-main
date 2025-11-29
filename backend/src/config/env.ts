import dotenv from 'dotenv';
dotenv.config();

export const env = {
  port: process.env.PORT || 4000,
  jwtSecret: process.env.JWT_SECRET || 'supersecret',
  adminEmail: process.env.ADMIN_EMAIL || 'adm@gmail.com',
  adminSenha: process.env.ADMIN_SENHA || 'adm123',
};
