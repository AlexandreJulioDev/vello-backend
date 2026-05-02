import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FaturasService } from './faturas.service';
import { CreateFaturaDto } from './dto/create-fatura.dto';
import { UpdateFaturaDto } from './dto/update-fatura.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('faturas')
export class FaturasController {
  constructor(private readonly faturasService: FaturasService) {}

  @Post()
  create(@Body() createFaturaDto: CreateFaturaDto, @Request() req) {
    return this.faturasService.create(createFaturaDto, req.user.id_provedor);
  }

  @Get()
  findAll(@Request() req) {
    return this.faturasService.findAll(req.user.id_provedor);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.faturasService.findOne(+id, req.user.id_provedor);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFaturaDto: UpdateFaturaDto, @Request() req) {
    return this.faturasService.update(+id, updateFaturaDto, req.user.id_provedor);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.faturasService.remove(+id, req.user.id_provedor);
  }
}
