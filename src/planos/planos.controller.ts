import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { PlanosService } from './planos.service';
import { CreatePlanoDto } from './dto/create-plano.dto';
import { UpdatePlanoDto } from './dto/update-plano.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../auth/public.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('planos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('planos')
export class PlanosController {
  constructor(private readonly planosService: PlanosService) {}

  @Post()
  create(@Body() createPlanoDto: CreatePlanoDto, @Request() req) {
    return this.planosService.create(createPlanoDto, req.user.id_provedor);
  }

  @Get()
  findAll(@Request() req) {
    return this.planosService.findAll(req.user.id_provedor);
  }

  // Rota pública para Landing Pages (ex: PHNet ou Bisanet)
  @Public()
  @Get('publico/:idProvedor')
  findPublic(@Param('idProvedor') idProvedor: string) {
    return this.planosService.findAll(idProvedor);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.planosService.findOne(+id, req.user.id_provedor);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlanoDto: UpdatePlanoDto, @Request() req) {
    return this.planosService.update(+id, updatePlanoDto, req.user.id_provedor);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.planosService.remove(+id, req.user.id_provedor);
  }
}
