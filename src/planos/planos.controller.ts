import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PlanosService } from './planos.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('planos') // Organiza no Swagger
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('planos')
export class PlanosController {
  constructor(private readonly planosService: PlanosService) {}

  @Get()
  findAll(@Request() req) {
    // Pega o provedor do Token, garantindo que um provedor não veja planos de outro
    return this.planosService.findAll(req.user.id_provedor);
  }

  @Post()
  create(@Body() createPlanoDto: any, @Request() req) {
    // Força o id_provedor do token na criação do plano
    return this.planosService.create({
      ...createPlanoDto,
      id_provedor: req.user.id_provedor
    });
  }
}
