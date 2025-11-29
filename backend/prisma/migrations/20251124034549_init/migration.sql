-- CreateEnum
CREATE TYPE "Escolaridade" AS ENUM ('FUNDAMENTAL', 'MEDIO', 'SUPERIOR', 'MESTRADO', 'DOUTORADO');

-- CreateEnum
CREATE TYPE "Sexo" AS ENUM ('MASCULINO', 'FEMININO', 'PREFERE_NAO_INFORMAR');

-- CreateEnum
CREATE TYPE "TipoVaga" AS ENUM ('REMOTA', 'HIBRIDA', 'PRESENCIAL');

-- CreateEnum
CREATE TYPE "StatusVaga" AS ENUM ('ATIVO', 'EXPIRADO', 'DESATIVADO');

-- CreateEnum
CREATE TYPE "TipoDeficiencia" AS ENUM ('FISICA', 'AUDITIVA', 'VISUAL', 'INTELECTUAL', 'PSICOSOCIAL', 'MULTIPLA', 'OUTRA');

-- CreateTable
CREATE TABLE "Usuario" (
    "id_usuario" SERIAL NOT NULL,
    "cpf" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "celular" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "nascimento" TIMESTAMP(3) NOT NULL,
    "sexo" "Sexo" NOT NULL,
    "escolaridade" "Escolaridade" NOT NULL,
    "tipo_deficiencia" "TipoDeficiencia" NOT NULL,
    "subtipo_deficiencia" TEXT NOT NULL,
    "barreiras" TEXT NOT NULL,
    "acessibilidades_necessarias" TEXT NOT NULL,
    "buscando_emprego" BOOLEAN NOT NULL DEFAULT true,
    "cep" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "Empresa" (
    "id_empresa" SERIAL NOT NULL,
    "cnpj" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Empresa_pkey" PRIMARY KEY ("id_empresa")
);

-- CreateTable
CREATE TABLE "Vaga" (
    "id_vaga" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "beneficios" TEXT,
    "deficiencias_compativeis" TEXT[],
    "tipo_vaga" "TipoVaga" NOT NULL,
    "salario" TEXT,
    "acessibilidades_oferecidas" TEXT,
    "data_fechamento" TIMESTAMP(3),
    "cidade" TEXT,
    "estado" TEXT,
    "status" "StatusVaga" NOT NULL DEFAULT 'ATIVO',
    "empresaId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "escolaridade_minima" "Escolaridade" NOT NULL DEFAULT 'FUNDAMENTAL',

    CONSTRAINT "Vaga_pkey" PRIMARY KEY ("id_vaga")
);

-- CreateTable
CREATE TABLE "VagaUsuario" (
    "id_vaga" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VagaUsuario_pkey" PRIMARY KEY ("id_vaga","id_usuario")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_cpf_key" ON "Usuario"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_cnpj_key" ON "Empresa"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_email_key" ON "Empresa"("email");

-- AddForeignKey
ALTER TABLE "Vaga" ADD CONSTRAINT "Vaga_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id_empresa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VagaUsuario" ADD CONSTRAINT "VagaUsuario_id_vaga_fkey" FOREIGN KEY ("id_vaga") REFERENCES "Vaga"("id_vaga") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VagaUsuario" ADD CONSTRAINT "VagaUsuario_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;
