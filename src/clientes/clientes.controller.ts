import { Controller, Get, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
// ADICIONE ESTA LINHA ABAIXO:
import { ClientesService } from './clientes.service'; 

@Controller('clientes')
export class ClientesController {
  // Agora o TypeScript vai reconhecer o ClientesService aqui:
  constructor(private readonly clientesService: ClientesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(@Query('id_provedor', ParseIntPipe) id_provedor: number) {
    return this.clientesService.findAll(id_provedor);
  }
}
