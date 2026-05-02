import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ClientesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateClienteDto, id_provedor: string) {
    const senha_hash = await bcrypt.hash(dto.senha, 10);

    return this.prisma.cliente.create({
      data: {
        nome: dto.nome,
        cpf: dto.cpf,
        rg: dto.rg,
        data_nascimento: new Date(dto.data_nascimento),
        email: dto.email,
        senha_hash,
        telefone: dto.telefone,
        telefone_alt: dto.telefone_alt,
        id_provedor: Number(id_provedor),
        endereco: {
          create: dto.endereco,
        },
      },
      include: {
        endereco: true,
      },
    });
  }

  async findAll(id_provedor: string) {
    return this.prisma.cliente.findMany({
      where: { id_provedor: Number(id_provedor) },
      include: { 
        endereco: true,
        contratos: {
          include: { plano: true }
        }
      },
      orderBy: { nome: 'asc' },
    });
  }

  async findOne(id: number, id_provedor: string) {
    const cliente = await this.prisma.cliente.findFirst({ 
      where: { 
        id_cliente: id,
        id_provedor: Number(id_provedor) 
      },
      include: {
        endereco: true,
        contratos: {
          include: { plano: true, ponto_rede: true }
        }
      }
    });
    
    if (!cliente) throw new NotFoundException('Cliente não encontrado neste provedor.');
    return cliente;
  }

  async update(id: number, dto: UpdateClienteDto, id_provedor: string) {
    await this.findOne(id, id_provedor); 

    let senha_hash;
    if (dto.senha) {
      senha_hash = await bcrypt.hash(dto.senha, 10);
    }

    return this.prisma.cliente.update({
      where: { id_cliente: id },
      data: {
        nome: dto.nome,
        cpf: dto.cpf,
        rg: dto.rg,
        data_nascimento: dto.data_nascimento ? new Date(dto.data_nascimento) : undefined,
        email: dto.email,
        senha_hash,
        telefone: dto.telefone,
        telefone_alt: dto.telefone_alt,
        endereco: dto.endereco ? {
          update: dto.endereco
        } : undefined,
      },
      include: {
        endereco: true,
      }
    });
  }

  async remove(id: number, id_provedor: string) {
    await this.findOne(id, id_provedor);
    
    // Deleta o endereço primeiro para evitar erro de constraint (ou conta com onDelete Cascade se houvesse no schema)
    const endereco = await this.prisma.endereco.findUnique({ where: { id_cliente: id }});
    if (endereco) {
      await this.prisma.endereco.delete({ where: { id_cliente: id } });
    }

    return this.prisma.cliente.delete({ where: { id_cliente: id } });
  }
}
