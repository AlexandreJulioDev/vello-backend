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
    const { email, senha, id_provedor } = body;

    if (!id_provedor) {
      throw new UnauthorizedException('O ID do provedor é obrigatório para o login.');
    }

    const user = await this.authService.validateUser(email, senha, Number(id_provedor));

    if (!user) {
      throw new UnauthorizedException('E-mail, senha ou provedor inválidos');
    }

    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() body: any) {
    const { id_provedor, email, cpf, senha, nome, data_nascimento, telefone } = body;

    if (!id_provedor) {
      throw new ConflictException('O ID do provedor é obrigatório para o cadastro.');
    }

    // Verifica se o provedor existe e está ativo
    const provedor = await this.prisma.provedor.findUnique({ 
      where: { id_provedor: Number(id_provedor) } 
    });

    if (!provedor || !provedor.ativo) {
      throw new ConflictException('Provedor inválido ou inativo.');
    }

    // Verifica se já existe um cliente com esse e-mail ou CPF dentro DESTE provedor
    const existente = await this.prisma.cliente.findFirst({
      where: {
        id_provedor: provedor.id_provedor,
        OR: [
          { email },
          { cpf },
        ],
      },
    });

    if (existente) {
      throw new ConflictException('Já existe uma conta com este e-mail ou CPF neste provedor.');
    }

    const senha_hash = await bcrypt.hash(senha, 10);

    const cliente = await this.prisma.cliente.create({
      data: {
        id_provedor: provedor.id_provedor,
        nome,
        cpf,
        data_nascimento: new Date(data_nascimento),
        email,
        senha_hash,
        telefone,
      },
    });

    // Login direto com o cliente que acabamos de criar
    return this.authService.login(cliente);
  }
}
