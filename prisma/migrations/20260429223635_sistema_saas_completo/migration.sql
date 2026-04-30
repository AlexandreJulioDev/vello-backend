/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `provedores` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `data_nascimento` to the `clientes` table without a default value. This is not possible if the table is not empty.
  - Made the column `telefone` on table `clientes` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `slug` to the `provedores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nome` to the `usuarios` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StatusFatura" AS ENUM ('PENDENTE', 'PAGO', 'ATRASADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "StatusAtendimento" AS ENUM ('PENDENTE', 'EM_EXECUCAO', 'CONCLUIDO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "StatusRede" AS ENUM ('OPERANTE', 'MANUTENCAO', 'QUEDA_TOTAL');

-- AlterTable
ALTER TABLE "clientes" ADD COLUMN     "data_nascimento" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "email" TEXT,
ALTER COLUMN "telefone" SET NOT NULL;

-- AlterTable
ALTER TABLE "planos" ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "provedores" ADD COLUMN     "cor_principal" TEXT DEFAULT '#1F6F9B',
ADD COLUMN     "logo_url" TEXT,
ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "nome" TEXT NOT NULL,
ALTER COLUMN "perfil" SET DEFAULT 'CLIENTE';

-- CreateTable
CREATE TABLE "faturas" (
    "id_fatura" SERIAL NOT NULL,
    "id_provedor" INTEGER NOT NULL,
    "id_cliente" INTEGER NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "data_vencimento" TIMESTAMP(3) NOT NULL,
    "data_pagamento" TIMESTAMP(3),
    "status" "StatusFatura" NOT NULL DEFAULT 'PENDENTE',
    "pix_copia_cola" TEXT,
    "link_boleto" TEXT,
    "id_transacao_gateway" TEXT,

    CONSTRAINT "faturas_pkey" PRIMARY KEY ("id_fatura")
);

-- CreateTable
CREATE TABLE "atendimentos" (
    "id_atendimento" SERIAL NOT NULL,
    "id_provedor" INTEGER NOT NULL,
    "id_cliente" INTEGER NOT NULL,
    "id_funcionario" INTEGER,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "status" "StatusAtendimento" NOT NULL DEFAULT 'PENDENTE',
    "nota_avaliacao" INTEGER,
    "comentario_cliente" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finalizado_em" TIMESTAMP(3),

    CONSTRAINT "atendimentos_pkey" PRIMARY KEY ("id_atendimento")
);

-- CreateTable
CREATE TABLE "rotas_rede" (
    "id_rota" SERIAL NOT NULL,
    "id_provedor" INTEGER NOT NULL,
    "nome_rota" TEXT NOT NULL,
    "ponto_referencia" TEXT,
    "status" "StatusRede" NOT NULL DEFAULT 'OPERANTE',
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,

    CONSTRAINT "rotas_rede_pkey" PRIMARY KEY ("id_rota")
);

-- CreateIndex
CREATE UNIQUE INDEX "provedores_slug_key" ON "provedores"("slug");

-- AddForeignKey
ALTER TABLE "faturas" ADD CONSTRAINT "faturas_id_provedor_fkey" FOREIGN KEY ("id_provedor") REFERENCES "provedores"("id_provedor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faturas" ADD CONSTRAINT "faturas_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "clientes"("id_cliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "atendimentos" ADD CONSTRAINT "atendimentos_id_provedor_fkey" FOREIGN KEY ("id_provedor") REFERENCES "provedores"("id_provedor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "atendimentos" ADD CONSTRAINT "atendimentos_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "clientes"("id_cliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "atendimentos" ADD CONSTRAINT "atendimentos_id_funcionario_fkey" FOREIGN KEY ("id_funcionario") REFERENCES "usuarios"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rotas_rede" ADD CONSTRAINT "rotas_rede_id_provedor_fkey" FOREIGN KEY ("id_provedor") REFERENCES "provedores"("id_provedor") ON DELETE RESTRICT ON UPDATE CASCADE;
