import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Iniciando o processo de Seed do Banco de Dados...');

  // 1. Limpa tabelas para evitar duplicação (se quiser)
  // await prisma.administrador.deleteMany();
  // await prisma.provedor.deleteMany();

  // 2. Cria o Provedor Base
  const provedor = await prisma.provedor.upsert({
    where: { cnpj: '00.000.000/0001-00' },
    update: {},
    create: {
      nome_fantasia: 'Vello Networks LTDA',
      razao_social: 'Vello Telecomunicacoes S.A.',
      cnpj: '00.000.000/0001-00',
      slug: 'vello-networks',
      email: 'contato@vellonetworks.com.br',
      telefone: '(11) 4000-0000',
    },
  });

  console.log(`✅ Provedor criado: ${provedor.nome_fantasia} (ID: ${provedor.id_provedor})`);

  // 3. Cria o Administrador Base
  const senha_hash = await bcrypt.hash('admin', 10);
  const admin = await prisma.administrador.upsert({
    where: {
      id_provedor_email: {
        id_provedor: provedor.id_provedor,
        email: 'admin@vello.com.br',
      },
    },
    update: { senha_hash }, // Atualiza a senha se já existir
    create: {
      id_provedor: provedor.id_provedor,
      nome: 'Administrador Geral',
      email: 'admin@vello.com.br',
      senha_hash,
      perfil: 'DONO',
    },
  });

  console.log(`✅ Usuário Administrador criado: ${admin.email}`);

  // 4. Cria Planos Iniciais
  const plano500 = await prisma.plano.create({
    data: {
      id_provedor: provedor.id_provedor,
      nome: 'Fibra 500 Mega Premium',
      velocidade_down: 500,
      velocidade_up: 250,
      preco: 99.90,
      fidelidade_meses: 12,
    }
  });
  console.log(`✅ Plano criado: ${plano500.nome}`);

  // 5. Cria uma Rota e CTO
  const rota = await prisma.rotaRede.create({
    data: {
      id_provedor: provedor.id_provedor,
      nome_rota: 'Rota Centro-Sul',
      descricao: 'Backbone principal da região central'
    }
  });

  const cto = await prisma.pontoRede.create({
    data: {
      id_provedor: provedor.id_provedor,
      id_rota: rota.id_rota,
      nome: 'CTO-01 (Centro)',
      tipo: 'CTO',
      portas_total: 16,
      portas_livres: 16,
      endereco_ref: 'Rua Principal, Poste 12'
    }
  });
  console.log(`✅ Infraestrutura básica criada: ${rota.nome_rota} / ${cto.nome}`);

  // 6. Cria um Cliente de Teste (para logar no Portal do Assinante)
  const senhaCliente = await bcrypt.hash('123456', 10);
  const cliente = await prisma.cliente.create({
    data: {
      id_provedor: provedor.id_provedor,
      nome: 'João Silva',
      cpf: '123.456.789-00',
      data_nascimento: new Date('1995-06-15'),
      email: 'cliente@vello.com.br',
      senha_hash: senhaCliente,
      telefone: '(11) 98765-4321',
      endereco: {
        create: {
          cep: '01001-000',
          rua: 'Rua das Fibras',
          numero: '42',
          bairro: 'Centro',
          cidade: 'São Paulo',
          estado: 'SP',
        },
      },
    },
  });
  console.log(`✅ Cliente criado: ${cliente.nome} (${cliente.email})`);

  // 7. Cria um Contrato vinculando o Cliente ao Plano 500 Mega
  const contrato = await prisma.contrato.create({
    data: {
      id_provedor: provedor.id_provedor,
      id_cliente: cliente.id_cliente,
      id_plano: plano500.id_plano,
      id_ponto_rede: cto.id_ponto,
      data_inicio: new Date(),
      dia_vencimento: 10,
      status: 'ATIVO',
    },
  });
  console.log(`✅ Contrato criado: ID ${contrato.id_contrato} (Plano 500 Mega)`);

  // 8. Cria uma Fatura de exemplo
  const fatura = await prisma.fatura.create({
    data: {
      id_provedor: provedor.id_provedor,
      id_cliente: cliente.id_cliente,
      id_contrato: contrato.id_contrato,
      valor: 99.90,
      data_vencimento: new Date('2026-06-10'),
      mes_referencia: '06/2026',
      status: 'PENDENTE',
      pix_copia_cola: '00020126580014BR.GOV.BCB.PIX0136a1b2c3d4-e5f6-7890-abcd-ef1234567890520400005303986540599.905802BR5913Vello Networks6009SAO PAULO62070503***6304ABCD',
    },
  });
  console.log(`✅ Fatura criada: R$ ${fatura.valor} - Vencimento: 10/06/2026`);

  console.log('🎉 Seed concluído com sucesso!');
  console.log('👤 Admin: admin@vello.com.br / admin');
  console.log('👤 Cliente: cliente@vello.com.br / 123456');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
