import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContratoDto } from './dto/create-contrato.dto';
import { UpdateContratoDto } from './dto/update-contrato.dto';

@Injectable()
export class ContratosService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateContratoDto, id_provedor: string) {
    return this.prisma.contrato.create({
      data: {
        ...dto,
        data_inicio: new Date(dto.data_inicio),
        data_fim: dto.data_fim ? new Date(dto.data_fim) : undefined,
        id_provedor: Number(id_provedor),
      },
    });
  }

  async findAll(id_provedor: string, id_cliente?: number) {
    return this.prisma.contrato.findMany({
      where: { 
        id_provedor: Number(id_provedor),
        ...(id_cliente ? { id_cliente } : {})
      },
      include: {
        cliente: true,
        plano: true,
        ponto_rede: true,
      },
      orderBy: { criado_em: 'desc' }
    });
  }

  async findOne(id: number, id_provedor: string, id_cliente?: number) {
    const contrato = await this.prisma.contrato.findFirst({
      where: { 
        id_contrato: id, 
        id_provedor: Number(id_provedor),
        ...(id_cliente ? { id_cliente } : {})
      },
      include: {
        cliente: true,
        plano: true,
        ponto_rede: true,
        faturas: true,
        equipamentos: true,
        historico: true
      }
    });
    if (!contrato) throw new NotFoundException('Contrato não encontrado.');
    return contrato;
  }

  async update(id: number, dto: UpdateContratoDto, id_provedor: string) {
    await this.findOne(id, id_provedor);
    
    // Podemos registrar histórico aqui se o status mudar, mas por enquanto fazemos update direto
    return this.prisma.contrato.update({
      where: { id_contrato: id },
      data: {
        ...dto,
        data_inicio: dto.data_inicio ? new Date(dto.data_inicio) : undefined,
        data_fim: dto.data_fim ? new Date(dto.data_fim) : undefined,
      },
    });
  }

  async remove(id: number, id_provedor: string) {
    await this.findOne(id, id_provedor);
    return this.prisma.contrato.delete({
      where: { id_contrato: id }
    });
  }
}
