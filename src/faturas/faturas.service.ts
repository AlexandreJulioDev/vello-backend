import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFaturaDto } from './dto/create-fatura.dto';
import { UpdateFaturaDto } from './dto/update-fatura.dto';

@Injectable()
export class FaturasService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateFaturaDto, id_provedor: string) {
    return this.prisma.fatura.create({
      data: {
        ...dto,
        data_vencimento: new Date(dto.data_vencimento),
        data_pagamento: dto.data_pagamento ? new Date(dto.data_pagamento) : undefined,
        id_provedor: Number(id_provedor),
      },
    });
  }

  async findAll(id_provedor: string) {
    return this.prisma.fatura.findMany({
      where: { id_provedor: Number(id_provedor) },
      include: {
        cliente: true,
        contrato: true,
      },
      orderBy: { data_vencimento: 'desc' }
    });
  }

  async findOne(id: number, id_provedor: string) {
    const fatura = await this.prisma.fatura.findFirst({
      where: { id_fatura: id, id_provedor: Number(id_provedor) },
      include: { cliente: true, contrato: true }
    });
    if (!fatura) throw new NotFoundException('Fatura não encontrada.');
    return fatura;
  }

  async update(id: number, dto: UpdateFaturaDto, id_provedor: string) {
    await this.findOne(id, id_provedor);

    return this.prisma.fatura.update({
      where: { id_fatura: id },
      data: {
        ...dto,
        data_vencimento: dto.data_vencimento ? new Date(dto.data_vencimento) : undefined,
        data_pagamento: dto.data_pagamento ? new Date(dto.data_pagamento) : undefined,
      },
    });
  }

  async remove(id: number, id_provedor: string) {
    await this.findOne(id, id_provedor);
    return this.prisma.fatura.delete({
      where: { id_fatura: id }
    });
  }
}
