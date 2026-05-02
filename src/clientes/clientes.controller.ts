import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('clientes')
@UseGuards(JwtAuthGuard) // Protege todas as rotas de clientes
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post()
  create(@Body() createClienteDto: CreateClienteDto, @Request() req) {
    return this.clientesService.create(createClienteDto, req.user.id_provedor);
  }

  @Get()
  findAll(@Request() req) {
    return this.clientesService.findAll(req.user.id_provedor);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.clientesService.findOne(+id, req.user.id_provedor);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClienteDto: UpdateClienteDto, @Request() req) {
    return this.clientesService.update(+id, updateClienteDto, req.user.id_provedor);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.clientesService.remove(+id, req.user.id_provedor);
  }
}
