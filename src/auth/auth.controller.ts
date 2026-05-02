import { Controller, Post, Get, Body, Param, Patch, UseGuards, Request, UnauthorizedException, ConflictException, BadRequestException, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { AuthGuard } from '@nestjs/passport';
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

  // ─── ATUALIZAR PERFIL (Self) ──────────────────────────
  @UseGuards(AuthGuard('jwt'))
  @Patch('perfil')
  async updatePerfil(@Body() body: any, @Request() req) {
    const { id, perfil } = req.user;
    const { nome, telefone, foto_url } = body;

    const perfisAdm = ['DONO', 'GERENTE'];
    const isAdm = perfisAdm.includes(perfil);

    if (isAdm) {
      return this.prisma.administrador.update({
        where: { id_adm: id },
        data: { nome, telefone, foto_url },
        select: { id_adm: true, nome: true, email: true, perfil: true, telefone: true, foto_url: true }
      });
    } else {
      return this.prisma.funcionario.update({
        where: { id_funcionario: id },
        data: { nome, telefone, foto_url },
        select: { id_funcionario: true, nome: true, email: true, perfil: true, telefone: true, foto_url: true }
      });
    }
  }

  // ─── UPLOAD DE FOTO ──────────────────────────────────
  @UseGuards(AuthGuard('jwt'))
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const path = './uploads';
        if (!fs.existsSync(path)) {
          fs.mkdirSync(path, { recursive: true });
        }
        cb(null, path);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }))
  async uploadFile(@UploadedFile() file: any) {
    if (!file) throw new BadRequestException('Nenhum arquivo enviado.');
    
    // Retorna a URL relativa para salvar no banco
    return { url: `/uploads/${file.filename}` };
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
