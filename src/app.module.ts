import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ClientesModule } from './clientes/clientes.module';
import { PlanosModule } from './planos/planos.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ProvedoresModule } from './provedores/provedores.module';
import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ContratosModule } from './contratos/contratos.module';
import { EquipamentosModule } from './equipamentos/equipamentos.module';
import { FaturasModule } from './faturas/faturas.module';
import { AtendimentosModule } from './atendimentos/atendimentos.module';
import { RedesModule } from './redes/redes.module';
import { NotificacoesModule } from './notificacoes/notificacoes.module';
import { AuditoriaModule } from './auditoria/auditoria.module';

@Module({
  imports: [
    // Módulo de conexão com o Banco de Dados (Prisma)
    PrismaModule,
    // Módulos de funcionalidades do Provedor
    ClientesModule,
    PlanosModule,
    UsuariosModule,
    ProvedoresModule,
    // Módulos de Segurança e Autenticação
    AuthModule,
    // Módulo de Estatísticas (o que criamos agora)
    DashboardModule,
    ContratosModule,
    EquipamentosModule,
    FaturasModule,
    AtendimentosModule,
    RedesModule,
    NotificacoesModule,
    AuditoriaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
