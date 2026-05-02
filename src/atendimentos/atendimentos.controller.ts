import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AtendimentosService } from './atendimentos.service';
import { CreateAtendimentoDto } from './dto/create-atendimento.dto';
import { UpdateAtendimentoDto } from './dto/update-atendimento.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('atendimentos')
export class AtendimentosController {
  constructor(private readonly atendimentosService: AtendimentosService) {}

  @Post()
  create(@Body() createAtendimentoDto: CreateAtendimentoDto, @Request() req) {
    return this.atendimentosService.create(createAtendimentoDto, req.user.id_provedor);
  }

  @Get()
  findAll(@Request() req) {
    return this.atendimentosService.findAll(req.user.id_provedor);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.atendimentosService.findOne(+id, req.user.id_provedor);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAtendimentoDto: UpdateAtendimentoDto, @Request() req) {
    return this.atendimentosService.update(+id, updateAtendimentoDto, req.user.id_provedor);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.atendimentosService.remove(+id, req.user.id_provedor);
  }
}
