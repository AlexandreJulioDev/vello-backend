/*
  Warnings:

  - You are about to alter the column `coordenadas` on the `enderecos` table. The data in that column could be lost. The data in that column will be cast from `geometry` to `Text`.
  - You are about to alter the column `coordenadas` on the `pontos_rede` table. The data in that column could be lost. The data in that column will be cast from `geometry` to `Text`.

*/
-- AlterTable
ALTER TABLE "enderecos" ALTER COLUMN "coordenadas" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "pontos_rede" ALTER COLUMN "coordenadas" SET DATA TYPE TEXT;
