import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ContratosService } from './contratos.service';
import { CreateContratoDto } from './dto/create-contrato.dto';
import { UpdateContratoDto } from './dto/update-contrato.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('contratos')
export class ContratosController {
  constructor(private readonly contratosService: ContratosService) {}

  @Post()
  create(@Body() createContratoDto: CreateContratoDto, @Request() req) {
    return this.contratosService.create(createContratoDto, req.user.id_provedor);
  }

  @Get()
  findAll(@Request() req) {
    return this.contratosService.findAll(req.user.id_provedor);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.contratosService.findOne(+id, req.user.id_provedor);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateContratoDto: UpdateContratoDto, @Request() req) {
    return this.contratosService.update(+id, updateContratoDto, req.user.id_provedor);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.contratosService.remove(+id, req.user.id_provedor);
  }
}
