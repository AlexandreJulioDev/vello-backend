import { Module } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { ClientesController } from './clientes.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule], // Essencial para o Service usar o banco
  controllers: [ClientesController],
  providers: [ClientesService],
})
export class ClientesModule {}
