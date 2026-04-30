import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  // 1. Criar usuário com senha protegida
  async create(dto: CreateUsuarioDto) {
    const usuarioExiste = await this.prisma.usuario.findUnique({
      where: { email: dto.email }
    });

    if (usuarioExiste) {
      throw new ConflictException('Este e-mail já está em uso.');
    }

    const senhaHash = await bcrypt.hash(dto.senha, 10);

    return this.prisma.usuario.create({
      data: {
        ...dto,
        senha: senhaHash,
      },
    });
  }

  // 2. Listar todos os usuários de um provedor (SaaS Isolation)
  async findAll(id_provedor: number) {
    return this.prisma.usuario.findMany({
      where: { id_provedor },
      select: { // Segurança: Não retorna a senha na lista
        id_usuario: true,
        nome: true,
        email: true,
        perfil: true,
        criado_em: true
      }
    });
  }

  // 3. Buscar um único usuário por ID
  async findOne(id: number) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id_usuario: id },
      select: { id_usuario: true, nome: true, email: true, perfil: true }
    });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado.');
    }
    return usuario;
  }

  // 4. Atualizar dados do usuário
  async update(id: number, dto: UpdateUsuarioDto) {
    // Se a senha for enviada para atualização, precisamos gerar um novo hash
    if (dto.senha) {
      dto.senha = await bcrypt.hash(dto.senha, 10);
    }

    return this.prisma.usuario.update({
      where: { id_usuario: id },
      data: dto,
    });
  }

  // 5. Remover usuário
  async remove(id: number) {
    return this.prisma.usuario.delete({
      where: { id_usuario: id }
    });
  }

  // 6. Função especial para o LOGIN (Busca por e-mail)
  async findByEmail(email: string) {
    return this.prisma.usuario.findUnique({
      where: { email },
    });
  }
}
