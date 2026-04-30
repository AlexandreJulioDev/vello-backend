import { Module } from '@nestjs/common';
import { ProvedoresService } from './provedores.service';
import { ProvedoresController } from './provedores.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule], // Importante para acessar o banco
  controllers: [ProvedoresController],
  providers: [ProvedoresService],
  exports: [ProvedoresService],
})
export class ProvedoresModule {}
