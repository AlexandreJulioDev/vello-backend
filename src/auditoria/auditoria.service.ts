import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditoriaService {
  constructor(private prisma: PrismaService) {}

  async findAll(id_provedor: string) {
    return this.prisma.auditLog.findMany({
      where: { id_provedor: Number(id_provedor) },
      orderBy: { criado_em: 'desc' },
      take: 100 // limitando por padrão para não pesar
    });
  }

  async findOne(id: number, id_provedor: string) {
    const log = await this.prisma.auditLog.findFirst({
      where: { id: id, id_provedor: Number(id_provedor) }
    });
    if (!log) throw new NotFoundException('Log de auditoria não encontrado.');
    return log;
  }
}
