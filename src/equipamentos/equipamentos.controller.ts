import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EquipamentosService } from './equipamentos.service';
import { CreateEquipamentoDto } from './dto/create-equipamento.dto';
import { UpdateEquipamentoDto } from './dto/update-equipamento.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('equipamentos')
export class EquipamentosController {
  constructor(private readonly equipamentosService: EquipamentosService) {}

  @Post()
  create(@Body() createEquipamentoDto: CreateEquipamentoDto, @Request() req) {
    return this.equipamentosService.create(createEquipamentoDto, req.user.id_provedor);
  }

  @Get()
  findAll(@Request() req) {
    return this.equipamentosService.findAll(req.user.id_provedor);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.equipamentosService.findOne(+id, req.user.id_provedor);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEquipamentoDto: UpdateEquipamentoDto, @Request() req) {
    return this.equipamentosService.update(+id, updateEquipamentoDto, req.user.id_provedor);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.equipamentosService.remove(+id, req.user.id_provedor);
  }
}
