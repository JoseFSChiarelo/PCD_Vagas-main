-- CreateTable
CREATE TABLE "DeficienciaCatalogo" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeficienciaCatalogo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BarreiraCatalogo" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "deficienciaId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BarreiraCatalogo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubtipoBarreiraCatalogo" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "barreiraId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubtipoBarreiraCatalogo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AcessibilidadeCatalogo" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AcessibilidadeCatalogo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubtipoAcessibilidadeCatalogo" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "acessibilidadeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubtipoAcessibilidadeCatalogo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BarreiraCatalogo" ADD CONSTRAINT "BarreiraCatalogo_deficienciaId_fkey" FOREIGN KEY ("deficienciaId") REFERENCES "DeficienciaCatalogo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubtipoBarreiraCatalogo" ADD CONSTRAINT "SubtipoBarreiraCatalogo_barreiraId_fkey" FOREIGN KEY ("barreiraId") REFERENCES "BarreiraCatalogo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubtipoAcessibilidadeCatalogo" ADD CONSTRAINT "SubtipoAcessibilidadeCatalogo_acessibilidadeId_fkey" FOREIGN KEY ("acessibilidadeId") REFERENCES "AcessibilidadeCatalogo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
