import { Module } from '@nestjs/common';
import { RedesController } from './redes.controller';
import { RedesService } from './redes.service';

@Module({
  controllers: [RedesController],
  providers: [RedesService]
})
export class RedesModule {}
