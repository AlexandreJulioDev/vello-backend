import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlanoDto } from './dto/create-plano.dto';
import { UpdatePlanoDto } from './dto/update-plano.dto';

@Injectable()
export class PlanosService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePlanoDto, id_provedor: string) {
    return this.prisma.plano.create({
      data: {
        ...dto,
        id_provedor: Number(id_provedor),
      },
    });
  }

  async findAll(id_provedor: string) {
    return this.prisma.plano.findMany({
      where: { id_provedor: Number(id_provedor) },
    });
  }

  async findOne(id: number, id_provedor: string) {
    const plano = await this.prisma.plano.findFirst({ 
      where: { 
        id_plano: id,
        id_provedor: Number(id_provedor)
      } 
    });
    if (!plano) throw new NotFoundException('Plano não encontrado.');
    return plano;
  }

  async update(id: number, dto: UpdatePlanoDto, id_provedor: string) {
    await this.findOne(id, id_provedor);

    return this.prisma.plano.update({
      where: { id_plano: id },
      data: dto,
    });
  }

  async remove(id: number, id_provedor: string) {
    await this.findOne(id, id_provedor);
    return this.prisma.plano.delete({ where: { id_plano: id } });
  }
}
