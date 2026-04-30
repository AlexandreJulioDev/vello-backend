import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Injectable()
export class ClientesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateClienteDto) {
    return this.prisma.cliente.create({
      data: {
        ...dto,
        data_nascimento: new Date(dto.data_nascimento), // Converte para o formato do banco
      },
    });
  }

  async findAll(id_provedor: number) {
    return this.prisma.cliente.findMany({
      where: { id_provedor }, // Isolamento de dados
      include: { plano: true }, // Traz os dados do plano junto
    });
  }

  async findOne(id: number) {
    const cliente = await this.prisma.cliente.findUnique({ where: { id_cliente: id } });
    if (!cliente) throw new NotFoundException('Cliente não encontrado.');
    return cliente;
  }

  async update(id: number, dto: UpdateClienteDto) {
    return this.prisma.cliente.update({
      where: { id_cliente: id },
      data: {
        ...dto,
        // Se houver data, converte. Se não, ignora.
        data_nascimento: dto.data_nascimento ? new Date(dto.data_nascimento) : undefined,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.cliente.delete({ where: { id_cliente: id } });
  }
}
