import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController, FuncionariosController, AdministradoresController } from './auth.controller';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy'; // Importe aqui

@Module({
  imports: [
    UsuariosModule,
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: 'MINHA_CHAVE_SECRETA_123',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController, FuncionariosController, AdministradoresController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
