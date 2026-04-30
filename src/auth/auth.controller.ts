import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: any) {
    // Tenta validar o usuário com e-mail e senha
    const user = await this.authService.validateUser(body.email, body.senha);

    if (!user) {
      throw new UnauthorizedException('E-mail ou senha inválidos');
    }

    // Retorna o Token JWT (o "crachá" da PHNET)
    return this.authService.login(user);
  }
}
