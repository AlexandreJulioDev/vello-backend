import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuariosService,
    private jwtService: JwtService,
  ) {}

  // 1. Valida se o usuário existe e se a senha está correta
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usuariosService.findByEmail(email);

    if (user && (await bcrypt.compare(pass, user.senha))) {
      // Removemos a senha do objeto antes de retornar por segurança
      const { senha, ...result } = user;
      return result;
    }
    return null;
  }

  // 2. Gera o Token JWT com os dados do usuário e do provedor
  async login(user: any) {
    const payload = { 
      email: user.email, 
      sub: user.id_usuario, 
      id_provedor: user.id_provedor, // Importante para o isolamento SaaS
      perfil: user.perfil 
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      usuario: {
        nome: user.nome,
        email: user.email,
        perfil: user.perfil
      }
    };
  }
}
