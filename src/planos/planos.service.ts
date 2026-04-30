import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlanoDto } from './dto/create-plano.dto';
import { UpdatePlanoDto } from './dto/update-plano.dto';

@Injectable()
export class PlanosService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePlanoDto) {
    return this.prisma.plano.create({
      data: {
        nome: dto.nome,
        velocidade: dto.velocidade,
        preco: dto.preco,
        id_provedor: dto.id_provedor,
      },
    });
  }

  async findAll(id_provedor: number) {
    return this.prisma.plano.findMany({
      where: { id_provedor },
    });
  }

  async findOne(id: number) {
    const plano = await this.prisma.plano.findUnique({ where: { id_plano: id } });
    if (!plano) throw new NotFoundException('Plano não encontrado.');
    return plano;
  }

  async update(id: number, dto: UpdatePlanoDto) {
    return this.prisma.plano.update({
      where: { id_plano: id },
      data: dto,
    });
  }

  async remove(id: number) {
    return this.prisma.plano.delete({ where: { id_plano: id } });
  }
}
