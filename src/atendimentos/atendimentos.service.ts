import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAtendimentoDto } from './dto/create-atendimento.dto';
import { UpdateAtendimentoDto } from './dto/update-atendimento.dto';

@Injectable()
export class AtendimentosService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAtendimentoDto, id_provedor: string) {
    return this.prisma.atendimento.create({
      data: {
        ...dto,
        data_agendamento: dto.data_agendamento ? new Date(dto.data_agendamento) : undefined,
        finalizado_em: dto.finalizado_em ? new Date(dto.finalizado_em) : undefined,
        id_provedor: Number(id_provedor),
      },
    });
  }

  async findAll(id_provedor: string) {
    return this.prisma.atendimento.findMany({
      where: { id_provedor: Number(id_provedor) },
      include: {
        cliente: true,
        tecnico: true,
      },
      orderBy: { criado_em: 'desc' }
    });
  }

  async findOne(id: number, id_provedor: string) {
    const atendimento = await this.prisma.atendimento.findFirst({
      where: { id_atendimento: id, id_provedor: Number(id_provedor) },
      include: { cliente: true, tecnico: true }
    });
    if (!atendimento) throw new NotFoundException('Atendimento não encontrado.');
    return atendimento;
  }

  async update(id: number, dto: UpdateAtendimentoDto, id_provedor: string) {
    await this.findOne(id, id_provedor);

    return this.prisma.atendimento.update({
      where: { id_atendimento: id },
      data: {
        ...dto,
        data_agendamento: dto.data_agendamento ? new Date(dto.data_agendamento) : undefined,
        finalizado_em: dto.finalizado_em ? new Date(dto.finalizado_em) : undefined,
      },
    });
  }

  async remove(id: number, id_provedor: string) {
    await this.findOne(id, id_provedor);
    return this.prisma.atendimento.delete({
      where: { id_atendimento: id }
    });
  }
}
