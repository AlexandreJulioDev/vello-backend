import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ClientesModule } from './clientes/clientes.module';
import { PlanosModule } from './planos/planos.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ProvedoresModule } from './provedores/provedores.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    ClientesModule,
    PlanosModule,
    UsuariosModule,
    ProvedoresModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
