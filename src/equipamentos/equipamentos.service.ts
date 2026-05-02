import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEquipamentoDto } from './dto/create-equipamento.dto';
import { UpdateEquipamentoDto } from './dto/update-equipamento.dto';

@Injectable()
export class EquipamentosService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateEquipamentoDto, id_provedor: string) {
    return this.prisma.equipamento.create({
      data: {
        ...dto,
        instalado_em: dto.instalado_em ? new Date(dto.instalado_em) : undefined,
        id_provedor: Number(id_provedor),
      },
    });
  }

  async findAll(id_provedor: string) {
    return this.prisma.equipamento.findMany({
      where: { id_provedor: Number(id_provedor) },
      include: {
        contrato: true,
      },
      orderBy: { instalado_em: 'desc' }
    });
  }

  async findOne(id: number, id_provedor: string) {
    const equipamento = await this.prisma.equipamento.findFirst({
      where: { id_equipamento: id, id_provedor: Number(id_provedor) },
      include: { contrato: true }
    });
    if (!equipamento) throw new NotFoundException('Equipamento não encontrado.');
    return equipamento;
  }

  async update(id: number, dto: UpdateEquipamentoDto, id_provedor: string) {
    await this.findOne(id, id_provedor);

    return this.prisma.equipamento.update({
      where: { id_equipamento: id },
      data: {
        ...dto,
        instalado_em: dto.instalado_em ? new Date(dto.instalado_em) : undefined,
      },
    });
  }

  async remove(id: number, id_provedor: string) {
    await this.findOne(id, id_provedor);
    return this.prisma.equipamento.delete({
      where: { id_equipamento: id }
    });
  }
}
