import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  // Busca por e-mail e provedor em Administradores, Funcionários ou Clientes
  async findByEmail(email: string, id_provedor: number) {
    // 1. Busca nos Administradores
    const admin = await this.prisma.administrador.findFirst({ 
      where: { email, id_provedor } 
    });
    if (admin) {
      return {
        ...admin,
        tipo_usuario: 'ADMIN',
        id_usuario: admin.id_adm,
        senha: admin.senha_hash
      };
    }

    // 2. Busca nos Funcionários
    const func = await this.prisma.funcionario.findFirst({ 
      where: { email, id_provedor } 
    });
    if (func) {
      return {
        ...func,
        tipo_usuario: 'FUNC',
        id_usuario: func.id_funcionario,
        senha: func.senha_hash
      };
    }

    // 3. Busca nos Clientes (assinantes do provedor)
    const cliente = await this.prisma.cliente.findFirst({ 
      where: { email, id_provedor } 
    });
    if (cliente) {
      return {
        ...cliente,
        tipo_usuario: 'CLIENTE',
        id_usuario: cliente.id_cliente,
        perfil: 'CLIENTE',
        senha: cliente.senha_hash
      };
    }

    return null;
  }
}
