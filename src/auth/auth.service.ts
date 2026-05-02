import { Injectable } from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuariosService,
    private jwtService: JwtService,
  ) {}

  /**
   * 1. Valida se o usuário existe e se a senha está correta.
   * Corrigido para evitar o erro 'data and hash arguments required'.
   */
  async validateUser(email: string, pass: string): Promise<any> {
    // Busca o usuário no PostgreSQL via Prisma
    const user = await this.usuariosService.findByEmail(email);

    // SEGURANÇA: Se o usuário não existir ou a senha enviada for nula, 
    // retornamos null imediatamente sem chamar o bcrypt.
    if (!user || !pass) {
      return null;
    }

    // Agora é seguro comparar, pois garantimos que 'pass' e 'user.senha' existem
    const isMatch = await bcrypt.compare(pass, user.senha);

    if (isMatch) {
      // Removemos a senha do objeto de retorno por segurança
      const { senha, ...result } = user;
      return result;
    }

    return null;
  }

  /**
   * 2. Gera o Token JWT com os dados do usuário e do provedor.
   * Mantém o isolamento SaaS necessário para o projeto Vello.
   */
  async login(user: any) {
    // Identifica se é um Cliente ou Usuário do sistema
    const isCliente = !!user.id_cliente;
    const userId = isCliente ? user.id_cliente : user.id_usuario;
    const userPerfil = isCliente ? 'CLIENTE' : user.perfil;

    const payload = { 
      email: user.email, 
      sub: userId, 
      id_provedor: user.id_provedor, 
      perfil: userPerfil 
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      usuario: {
        id: userId,
        nome: user.nome,
        email: user.email,
        perfil: userPerfil,
        id_provedor: user.id_provedor
      }
    };
  }
}
