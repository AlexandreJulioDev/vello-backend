import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';

@Module({
  controllers: [UsuariosController],
  providers: [UsuariosService],
  // ADICIONE ESTA LINHA ABAIXO:
  exports: [UsuariosService],
})
export class UsuariosModule {}
