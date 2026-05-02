import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificacaoDto } from './dto/create-notificacao.dto';

@Injectable()
export class NotificacoesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateNotificacaoDto, id_provedor: string) {
    return this.prisma.notificacao.create({
      data: {
        ...dto,
        id_provedor: Number(id_provedor),
      },
    });
  }

  async findAll(id_provedor: string) {
    return this.prisma.notificacao.findMany({
      where: { id_provedor: Number(id_provedor) },
      include: { cliente: true },
      orderBy: { criado_em: 'desc' }
    });
  }

  async findOne(id: number, id_provedor: string) {
    const notificacao = await this.prisma.notificacao.findFirst({
      where: { id_notificacao: id, id_provedor: Number(id_provedor) }
    });
    if (!notificacao) throw new NotFoundException('Notificação não encontrada.');
    return notificacao;
  }
}
