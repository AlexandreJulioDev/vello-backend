import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @UseGuards(JwtAuthGuard)
  @Get('stats')
  async getStats(@Request() req) {
    // O id_provedor foi injetado no payload do JWT no seu AuthService
    const { id_provedor } = req.user;
    return this.dashboardService.getStats(id_provedor);
  }
}
