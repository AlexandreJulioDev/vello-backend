import 'dotenv/config';
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    });
    super({ adapter });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log(' Conexão com o banco estabelecida com sucesso!');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      console.error(' Erro de conexão. Verifique se o Docker está rodando!');
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
