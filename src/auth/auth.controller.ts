import { Controller, Post, Body, UnauthorizedException, ConflictException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private prisma: PrismaService,
  ) {}

  @Post('login')
  async login(@Body() body: any) {
    const user = await this.authService.validateUser(body.email, body.senha);

    if (!user) {
      throw new UnauthorizedException('E-mail ou senha inválidos');
    }

    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() body: any) {
    // Verifica se já existe um cliente com esse e-mail ou CPF
    const provedor = await this.prisma.provedor.findFirst({ where: { ativo: true } });
    if (!provedor) {
      throw new ConflictException('Nenhum provedor ativo encontrado.');
    }

    const existente = await this.prisma.cliente.findFirst({
      where: {
        id_provedor: provedor.id_provedor,
        OR: [
          { email: body.email },
          { cpf: body.cpf },
        ],
      },
    });

    if (existente) {
      throw new ConflictException('Já existe uma conta com este e-mail ou CPF.');
    }

    const senha_hash = await bcrypt.hash(body.senha, 10);

    const cliente = await this.prisma.cliente.create({
      data: {
        id_provedor: provedor.id_provedor,
        nome: body.nome,
        cpf: body.cpf,
        data_nascimento: new Date(body.data_nascimento),
        email: body.email,
        senha_hash,
        telefone: body.telefone,
      },
    });

    // Login direto com o cliente que acabamos de criar
    return this.authService.login(cliente);
  }
}
