import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProvedoreDto } from './dto/create-provedore.dto';
import { UpdateProvedoreDto } from './dto/update-provedore.dto';

@Injectable()
export class ProvedoresService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateProvedoreDto) {
    const existe = await this.prisma.provedor.findFirst({
      where: {
        OR: [{ cnpj: data.cnpj }, { slug: data.slug }]
      }
    });

    if (existe) {
      throw new ConflictException('CNPJ ou Slug já cadastrado no sistema.');
    }

    return this.prisma.provedor.create({
      data: {
        ...data,
        slug: data.slug.toLowerCase(),
      }
    });
  }

  async findAll() {
    return this.prisma.provedor.findMany({
      orderBy: { criado_em: 'desc' }
    });
  }

  async findOne(id: number) {
    const provedor = await this.prisma.provedor.findUnique({
      where: { id_provedor: id }
    });

    if (!provedor) throw new NotFoundException('Provedor não encontrado.');
    return provedor;
  }

  async update(id: number, data: UpdateProvedoreDto) {
    await this.findOne(id);
    return this.prisma.provedor.update({
      where: { id_provedor: id },
      data
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.provedor.delete({
      where: { id_provedor: id }
    });
  }
}
