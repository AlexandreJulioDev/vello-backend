import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats(id_provedor: string) {
    // Convertemos a string do JWT para número para o PostgreSQL
    const idProvedorInt = Number(id_provedor);

    const [totalClientes, planosAtivos] = await Promise.all([
      this.prisma.cliente.count({
        where: { id_provedor: idProvedorInt } 
      }),
      this.prisma.plano.count({
        where: { id_provedor: idProvedorInt }
      })
    ]);

    return {
      totalClientes,
      planosAtivos,
      faturamento: 'R$ 0,00',
    };
  }
}
