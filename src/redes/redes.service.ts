import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRotaDto, CreatePontoDto } from './dto/create-rede.dto';

@Injectable()
export class RedesService {
  constructor(private prisma: PrismaService) {}

  // ====================== ROTAS ======================
  async createRota(dto: CreateRotaDto, id_provedor: string) {
    return this.prisma.rotaRede.create({
      data: { ...dto, id_provedor: Number(id_provedor) }
    });
  }

  async findAllRotas(id_provedor: string) {
    return this.prisma.rotaRede.findMany({
      where: { id_provedor: Number(id_provedor) },
      include: { pontos_rede: true }
    });
  }

  async findOneRota(id: number, id_provedor: string) {
    const rota = await this.prisma.rotaRede.findFirst({
      where: { id_rota: id, id_provedor: Number(id_provedor) },
      include: { pontos_rede: true }
    });
    if (!rota) throw new NotFoundException('Rota não encontrada.');
    return rota;
  }

  // ====================== PONTOS ======================
  async createPonto(dto: CreatePontoDto, id_provedor: string) {
    return this.prisma.pontoRede.create({
      data: { ...dto, id_provedor: Number(id_provedor) }
    });
  }

  async findAllPontos(id_provedor: string) {
    return this.prisma.pontoRede.findMany({
      where: { id_provedor: Number(id_provedor) },
      include: { rota: true }
    });
  }

  async findOnePonto(id: number, id_provedor: string) {
    const ponto = await this.prisma.pontoRede.findFirst({
      where: { id_ponto: id, id_provedor: Number(id_provedor) }
    });
    if (!ponto) throw new NotFoundException('Ponto de rede não encontrado.');
    return ponto;
  }
}
