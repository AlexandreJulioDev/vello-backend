import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProvedoreDto } from './dto/create-provedore.dto';

@Injectable()
export class ProvedoresService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateProvedoreDto) {
    // Validação de duplicidade
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
        nome_fantasia: data.nome_fantasia,
        cnpj: data.cnpj,
        slug: data.slug.toLowerCase(),
        logo_url: data.logo_url,
        cor_principal: data.cor_principal || '#1F6F9B',
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
}
