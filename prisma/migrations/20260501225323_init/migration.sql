
-- CreateEnum
CREATE TYPE "PerfilAdm" AS ENUM ('DONO', 'GERENTE');

-- CreateEnum
CREATE TYPE "PerfilFuncionario" AS ENUM ('TECNICO_EXTERNO', 'SUPORTE_INTERNO');

-- CreateEnum
CREATE TYPE "StatusContrato" AS ENUM ('ATIVO', 'SUSPENSO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "StatusFatura" AS ENUM ('PENDENTE', 'PAGO', 'ATRASADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "MetodoPagamento" AS ENUM ('PIX', 'BOLETO', 'CARTAO_CREDITO');

-- CreateEnum
CREATE TYPE "StatusAtendimento" AS ENUM ('PENDENTE', 'EM_EXECUCAO', 'CONCLUIDO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "TipoAtendimento" AS ENUM ('INSTALACAO', 'MANUTENCAO', 'SUPORTE', 'CANCELAMENTO', 'VISITA_TECNICA');

-- CreateEnum
CREATE TYPE "PrioridadeAtendimento" AS ENUM ('BAIXA', 'MEDIA', 'ALTA', 'URGENTE');

-- CreateEnum
CREATE TYPE "StatusRede" AS ENUM ('OPERANTE', 'MANUTENCAO', 'QUEDA_TOTAL');

-- CreateEnum
CREATE TYPE "TipoPontoRede" AS ENUM ('OLT', 'CTO', 'SPLITTER', 'POSTE', 'CAIXA_HERMETICA');

-- CreateEnum
CREATE TYPE "CanalNotificacao" AS ENUM ('EMAIL', 'WHATSAPP', 'SMS', 'PUSH');

-- CreateEnum
CREATE TYPE "TipoEquipamento" AS ENUM ('ONU', 'ROTEADOR', 'SWITCH', 'CABO', 'OUTROS');

-- CreateTable
CREATE TABLE "provedores" (
    "id_provedor" SERIAL NOT NULL,
    "nome_fantasia" TEXT NOT NULL,
    "razao_social" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "telefone" TEXT,
    "email" TEXT,
    "logo_url" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "provedores_pkey" PRIMARY KEY ("id_provedor")
);

-- CreateTable
CREATE TABLE "administradores" (
    "id_adm" SERIAL NOT NULL,
    "id_provedor" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha_hash" TEXT NOT NULL,
    "perfil" "PerfilAdm" NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "administradores_pkey" PRIMARY KEY ("id_adm")
);

-- CreateTable
CREATE TABLE "funcionarios" (
    "id_funcionario" SERIAL NOT NULL,
    "id_provedor" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha_hash" TEXT NOT NULL,
    "telefone" TEXT,
    "foto_url" TEXT,
    "perfil" "PerfilFuncionario" NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "funcionarios_pkey" PRIMARY KEY ("id_funcionario")
);

-- CreateTable
CREATE TABLE "clientes" (
    "id_cliente" SERIAL NOT NULL,
    "id_provedor" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "rg" TEXT,
    "data_nascimento" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "senha_hash" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "telefone_alt" TEXT,
    "protocolo_instalacao" TEXT,
    "data_instalacao" TIMESTAMP(3),
    "mac_address_rede" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id_cliente")
);

-- CreateTable
CREATE TABLE "enderecos" (
    "id_endereco" SERIAL NOT NULL,
    "id_cliente" INTEGER NOT NULL,
    "cep" TEXT NOT NULL,
    "rua" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "complemento" TEXT,
    "referencia" TEXT,
    "coordenadas" TEXT,

    CONSTRAINT "enderecos_pkey" PRIMARY KEY ("id_endereco")
);

-- CreateTable
CREATE TABLE "planos" (
    "id_plano" SERIAL NOT NULL,
    "id_provedor" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "velocidade_down" INTEGER NOT NULL,
    "velocidade_up" INTEGER NOT NULL,
    "preco" DECIMAL(10,2) NOT NULL,
    "descricao" TEXT,
    "fidelidade_meses" INTEGER NOT NULL DEFAULT 0,
    "portas_consumidas" INTEGER NOT NULL DEFAULT 0,
    "banda_compartilhada" BOOLEAN NOT NULL DEFAULT false,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "planos_pkey" PRIMARY KEY ("id_plano")
);

-- CreateTable
CREATE TABLE "contratos" (
    "id_contrato" SERIAL NOT NULL,
    "id_provedor" INTEGER NOT NULL,
    "id_cliente" INTEGER NOT NULL,
    "id_plano" INTEGER NOT NULL,
    "id_ponto_rede" INTEGER,
    "data_inicio" TIMESTAMP(3) NOT NULL,
    "data_fim" TIMESTAMP(3),
    "dia_vencimento" INTEGER NOT NULL DEFAULT 10,
    "status" "StatusContrato" NOT NULL DEFAULT 'ATIVO',
    "observacoes" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contratos_pkey" PRIMARY KEY ("id_contrato")
);

-- CreateTable
CREATE TABLE "historico_contratos" (
    "id" SERIAL NOT NULL,
    "id_contrato" INTEGER NOT NULL,
    "status_anterior" "StatusContrato" NOT NULL,
    "status_novo" "StatusContrato" NOT NULL,
    "motivo" TEXT,
    "alterado_por" TEXT,
    "alterado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historico_contratos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipamentos" (
    "id_equipamento" SERIAL NOT NULL,
    "id_provedor" INTEGER NOT NULL,
    "id_contrato" INTEGER NOT NULL,
    "tipo" "TipoEquipamento" NOT NULL,
    "marca" TEXT,
    "modelo" TEXT,
    "numero_serie" TEXT,
    "mac_address" TEXT,
    "instalado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "devolvido_em" TIMESTAMP(3),
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "observacoes" TEXT,

    CONSTRAINT "equipamentos_pkey" PRIMARY KEY ("id_equipamento")
);

-- CreateTable
CREATE TABLE "faturas" (
    "id_fatura" SERIAL NOT NULL,
    "id_provedor" INTEGER NOT NULL,
    "id_cliente" INTEGER NOT NULL,
    "id_contrato" INTEGER NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "valor_pago" DECIMAL(10,2),
    "data_emissao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_vencimento" TIMESTAMP(3) NOT NULL,
    "data_pagamento" TIMESTAMP(3),
    "mes_referencia" TEXT NOT NULL,
    "status" "StatusFatura" NOT NULL DEFAULT 'PENDENTE',
    "metodo_pagamento" "MetodoPagamento",
    "pix_copia_cola" TEXT,
    "link_boleto" TEXT,
    "id_transacao_gateway" TEXT,
    "observacoes" TEXT,

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
    "tipo" "TipoAtendimento" NOT NULL,
    "prioridade" "PrioridadeAtendimento" NOT NULL DEFAULT 'MEDIA',
    "status" "StatusAtendimento" NOT NULL DEFAULT 'PENDENTE',
    "data_agendamento" TIMESTAMP(3),
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,
    "finalizado_em" TIMESTAMP(3),
    "nota_avaliacao" INTEGER,
    "comentario_cliente" TEXT,

    CONSTRAINT "atendimentos_pkey" PRIMARY KEY ("id_atendimento")
);

-- CreateTable
CREATE TABLE "rotas_rede" (
    "id_rota" SERIAL NOT NULL,
    "id_provedor" INTEGER NOT NULL,
    "nome_rota" TEXT NOT NULL,
    "descricao" TEXT,
    "ponto_referencia" TEXT,
    "status" "StatusRede" NOT NULL DEFAULT 'OPERANTE',
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rotas_rede_pkey" PRIMARY KEY ("id_rota")
);

-- CreateTable
CREATE TABLE "pontos_rede" (
    "id_ponto" SERIAL NOT NULL,
    "id_provedor" INTEGER NOT NULL,
    "id_rota" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" "TipoPontoRede" NOT NULL,
    "portas_total" INTEGER NOT NULL DEFAULT 8,
    "portas_livres" INTEGER NOT NULL DEFAULT 8,
    "status" "StatusRede" NOT NULL DEFAULT 'OPERANTE',
    "endereco_ref" TEXT,
    "coordenadas" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pontos_rede_pkey" PRIMARY KEY ("id_ponto")
);

-- CreateTable
CREATE TABLE "notificacoes" (
    "id_notificacao" SERIAL NOT NULL,
    "id_provedor" INTEGER NOT NULL,
    "id_cliente" INTEGER NOT NULL,
    "canal" "CanalNotificacao" NOT NULL,
    "assunto" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    "enviado" BOOLEAN NOT NULL DEFAULT false,
    "enviado_em" TIMESTAMP(3),
    "erro" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notificacoes_pkey" PRIMARY KEY ("id_notificacao")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" SERIAL NOT NULL,
    "id_provedor" INTEGER NOT NULL,
    "tabela" TEXT NOT NULL,
    "acao" TEXT NOT NULL,
    "dados_antes" JSONB,
    "dados_depois" JSONB,
    "usuario" TEXT,
    "ip" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "provedores_cnpj_key" ON "provedores"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "provedores_slug_key" ON "provedores"("slug");

-- CreateIndex
CREATE INDEX "administradores_id_provedor_idx" ON "administradores"("id_provedor");

-- CreateIndex
CREATE UNIQUE INDEX "administradores_id_provedor_email_key" ON "administradores"("id_provedor", "email");

-- CreateIndex
CREATE INDEX "funcionarios_id_provedor_idx" ON "funcionarios"("id_provedor");

-- CreateIndex
CREATE UNIQUE INDEX "funcionarios_id_provedor_email_key" ON "funcionarios"("id_provedor", "email");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_protocolo_instalacao_key" ON "clientes"("protocolo_instalacao");

-- CreateIndex
CREATE INDEX "clientes_id_provedor_idx" ON "clientes"("id_provedor");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_id_provedor_email_key" ON "clientes"("id_provedor", "email");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_id_provedor_cpf_key" ON "clientes"("id_provedor", "cpf");

-- CreateIndex
CREATE UNIQUE INDEX "enderecos_id_cliente_key" ON "enderecos"("id_cliente");

-- CreateIndex
CREATE INDEX "planos_id_provedor_idx" ON "planos"("id_provedor");

-- CreateIndex
CREATE INDEX "contratos_id_provedor_idx" ON "contratos"("id_provedor");

-- CreateIndex
CREATE INDEX "contratos_id_cliente_idx" ON "contratos"("id_cliente");

-- CreateIndex
CREATE INDEX "contratos_id_provedor_status_idx" ON "contratos"("id_provedor", "status");

-- CreateIndex
CREATE INDEX "historico_contratos_id_contrato_idx" ON "historico_contratos"("id_contrato");

-- CreateIndex
CREATE INDEX "equipamentos_id_provedor_idx" ON "equipamentos"("id_provedor");

-- CreateIndex
CREATE INDEX "equipamentos_id_contrato_idx" ON "equipamentos"("id_contrato");

-- CreateIndex
CREATE INDEX "faturas_id_provedor_status_idx" ON "faturas"("id_provedor", "status");

-- CreateIndex
CREATE INDEX "faturas_id_cliente_idx" ON "faturas"("id_cliente");

-- CreateIndex
CREATE INDEX "faturas_id_contrato_idx" ON "faturas"("id_contrato");

-- CreateIndex
CREATE INDEX "faturas_data_vencimento_idx" ON "faturas"("data_vencimento");

-- CreateIndex
CREATE UNIQUE INDEX "faturas_id_contrato_mes_referencia_key" ON "faturas"("id_contrato", "mes_referencia");

-- CreateIndex
CREATE INDEX "atendimentos_id_provedor_status_idx" ON "atendimentos"("id_provedor", "status");

-- CreateIndex
CREATE INDEX "atendimentos_id_cliente_idx" ON "atendimentos"("id_cliente");

-- CreateIndex
CREATE INDEX "atendimentos_id_funcionario_idx" ON "atendimentos"("id_funcionario");

-- CreateIndex
CREATE INDEX "rotas_rede_id_provedor_idx" ON "rotas_rede"("id_provedor");

-- CreateIndex
CREATE INDEX "pontos_rede_id_provedor_idx" ON "pontos_rede"("id_provedor");

-- CreateIndex
CREATE INDEX "pontos_rede_id_rota_idx" ON "pontos_rede"("id_rota");

-- CreateIndex
CREATE INDEX "notificacoes_id_provedor_enviado_idx" ON "notificacoes"("id_provedor", "enviado");

-- CreateIndex
CREATE INDEX "notificacoes_id_cliente_idx" ON "notificacoes"("id_cliente");

-- CreateIndex
CREATE INDEX "audit_logs_id_provedor_idx" ON "audit_logs"("id_provedor");

-- AddForeignKey
ALTER TABLE "administradores" ADD CONSTRAINT "administradores_id_provedor_fkey" FOREIGN KEY ("id_provedor") REFERENCES "provedores"("id_provedor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "funcionarios" ADD CONSTRAINT "funcionarios_id_provedor_fkey" FOREIGN KEY ("id_provedor") REFERENCES "provedores"("id_provedor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clientes" ADD CONSTRAINT "clientes_id_provedor_fkey" FOREIGN KEY ("id_provedor") REFERENCES "provedores"("id_provedor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enderecos" ADD CONSTRAINT "enderecos_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "clientes"("id_cliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planos" ADD CONSTRAINT "planos_id_provedor_fkey" FOREIGN KEY ("id_provedor") REFERENCES "provedores"("id_provedor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contratos" ADD CONSTRAINT "contratos_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "clientes"("id_cliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contratos" ADD CONSTRAINT "contratos_id_plano_fkey" FOREIGN KEY ("id_plano") REFERENCES "planos"("id_plano") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contratos" ADD CONSTRAINT "contratos_id_provedor_fkey" FOREIGN KEY ("id_provedor") REFERENCES "provedores"("id_provedor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contratos" ADD CONSTRAINT "contratos_id_ponto_rede_fkey" FOREIGN KEY ("id_ponto_rede") REFERENCES "pontos_rede"("id_ponto") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historico_contratos" ADD CONSTRAINT "historico_contratos_id_contrato_fkey" FOREIGN KEY ("id_contrato") REFERENCES "contratos"("id_contrato") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipamentos" ADD CONSTRAINT "equipamentos_id_provedor_fkey" FOREIGN KEY ("id_provedor") REFERENCES "provedores"("id_provedor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipamentos" ADD CONSTRAINT "equipamentos_id_contrato_fkey" FOREIGN KEY ("id_contrato") REFERENCES "contratos"("id_contrato") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faturas" ADD CONSTRAINT "faturas_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "clientes"("id_cliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faturas" ADD CONSTRAINT "faturas_id_contrato_fkey" FOREIGN KEY ("id_contrato") REFERENCES "contratos"("id_contrato") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faturas" ADD CONSTRAINT "faturas_id_provedor_fkey" FOREIGN KEY ("id_provedor") REFERENCES "provedores"("id_provedor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "atendimentos" ADD CONSTRAINT "atendimentos_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "clientes"("id_cliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "atendimentos" ADD CONSTRAINT "atendimentos_id_funcionario_fkey" FOREIGN KEY ("id_funcionario") REFERENCES "funcionarios"("id_funcionario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "atendimentos" ADD CONSTRAINT "atendimentos_id_provedor_fkey" FOREIGN KEY ("id_provedor") REFERENCES "provedores"("id_provedor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rotas_rede" ADD CONSTRAINT "rotas_rede_id_provedor_fkey" FOREIGN KEY ("id_provedor") REFERENCES "provedores"("id_provedor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pontos_rede" ADD CONSTRAINT "pontos_rede_id_provedor_fkey" FOREIGN KEY ("id_provedor") REFERENCES "provedores"("id_provedor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pontos_rede" ADD CONSTRAINT "pontos_rede_id_rota_fkey" FOREIGN KEY ("id_rota") REFERENCES "rotas_rede"("id_rota") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificacoes" ADD CONSTRAINT "notificacoes_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "clientes"("id_cliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificacoes" ADD CONSTRAINT "notificacoes_id_provedor_fkey" FOREIGN KEY ("id_provedor") REFERENCES "provedores"("id_provedor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_id_provedor_fkey" FOREIGN KEY ("id_provedor") REFERENCES "provedores"("id_provedor") ON DELETE RESTRICT ON UPDATE CASCADE;
