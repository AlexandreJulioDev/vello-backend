import { Controller, Post, Get, Body, Param, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private prisma: PrismaService,
  ) {}

  // ─── LOGIN ─────────────────────────────────────────────────────
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

  // ─── CADASTRO CLIENTE (self-service) ──────────────────────────
  @Post('register')
  async register(@Body() body: any) {
    const { id_provedor, email, cpf, senha, nome, data_nascimento, telefone } = body;

    if (!id_provedor) throw new ConflictException('O ID do provedor é obrigatório para o cadastro.');

    const provedor = await this.prisma.provedor.findUnique({ where: { id_provedor: Number(id_provedor) } });
    if (!provedor || !provedor.ativo) throw new ConflictException('Provedor inválido ou inativo.');

    const existente = await this.prisma.cliente.findFirst({
      where: { id_provedor: provedor.id_provedor, OR: [{ email }, { cpf }] },
    });
    if (existente) throw new ConflictException('Já existe uma conta com este e-mail ou CPF neste provedor.');

    const senha_hash = await bcrypt.hash(senha, 10);

    const cliente = await this.prisma.cliente.create({
      data: {
        id_provedor: provedor.id_provedor,
        nome, cpf,
        data_nascimento: new Date(data_nascimento),
        email, senha_hash, telefone,
      },
    });

    return this.authService.login(cliente);
  }
}

// =============================================================
//  FUNCIONÁRIOS  —  /funcionarios
// =============================================================
@Controller('funcionarios')
export class FuncionariosController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async listar() {
    return this.prisma.funcionario.findMany({
      select: {
        id_funcionario: true,
        nome: true,
        email: true,
        perfil: true,
        ativo: true,
        criado_em: true,
      },
      orderBy: { criado_em: 'desc' },
    });
  }

  @Post()
  async criar(@Body() body: any) {
    const { nome, email, senha, perfil, id_provedor } = body;

    if (!nome || !email || !senha || !perfil || !id_provedor) {
      throw new BadRequestException('nome, email, senha, perfil e id_provedor são obrigatórios.');
    }

    const perfisValidos = ['TECNICO_EXTERNO', 'SUPORTE_INTERNO'];
    if (!perfisValidos.includes(perfil)) {
      throw new BadRequestException(`Perfil inválido. Use: ${perfisValidos.join(' ou ')}.`);
    }

    const existente = await this.prisma.funcionario.findFirst({
      where: { email, id_provedor: Number(id_provedor) },
    });
    if (existente) throw new ConflictException('Já existe um funcionário com este e-mail neste provedor.');

    const senha_hash = await bcrypt.hash(senha, 10);

    return this.prisma.funcionario.create({
      data: {
        id_provedor: Number(id_provedor),
        nome, email, senha_hash,
        perfil: perfil as any,
      },
      select: { id_funcionario: true, nome: true, email: true, perfil: true, ativo: true, criado_em: true },
    });
  }
}

// =============================================================
//  ADMINISTRADORES  —  /administradores
// =============================================================
@Controller('administradores')
export class AdministradoresController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async listar() {
    return this.prisma.administrador.findMany({
      select: {
        id_adm: true,
        nome: true,
        email: true,
        perfil: true,
        ativo: true,
        criado_em: true,
      },
      orderBy: { criado_em: 'desc' },
    });
  }

  @Post()
  async criar(@Body() body: any) {
    const { nome, email, senha, perfil, id_provedor } = body;

    if (!nome || !email || !senha || !perfil || !id_provedor) {
      throw new BadRequestException('nome, email, senha, perfil e id_provedor são obrigatórios.');
    }

    const perfisValidos = ['DONO', 'GERENTE'];
    if (!perfisValidos.includes(perfil)) {
      throw new BadRequestException(`Perfil inválido. Use: ${perfisValidos.join(' ou ')}.`);
    }

    const existente = await this.prisma.administrador.findFirst({
      where: { email, id_provedor: Number(id_provedor) },
    });
    if (existente) throw new ConflictException('Já existe um administrador com este e-mail neste provedor.');

    const senha_hash = await bcrypt.hash(senha, 10);

    return this.prisma.administrador.create({
      data: {
        id_provedor: Number(id_provedor),
        nome, email, senha_hash,
        perfil: perfil as any,
      },
      select: { id_adm: true, nome: true, email: true, perfil: true, ativo: true, criado_em: true },
    });
  }
}
