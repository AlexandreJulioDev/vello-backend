import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RedesService } from './redes.service';
import { CreateRotaDto, CreatePontoDto } from './dto/create-rede.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('redes')
export class RedesController {
  constructor(private readonly redesService: RedesService) {}

  @Post('rotas')
  createRota(@Body() dto: CreateRotaDto, @Request() req) {
    return this.redesService.createRota(dto, req.user.id_provedor);
  }

  @Get('rotas')
  findAllRotas(@Request() req) {
    return this.redesService.findAllRotas(req.user.id_provedor);
  }

  @Post('pontos')
  createPonto(@Body() dto: CreatePontoDto, @Request() req) {
    return this.redesService.createPonto(dto, req.user.id_provedor);
  }

  @Get('pontos')
  findAllPontos(@Request() req) {
    return this.redesService.findAllPontos(req.user.id_provedor);
  }
}
