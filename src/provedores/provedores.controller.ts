import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ProvedoresService } from './provedores.service';
import { CreateProvedoreDto } from './dto/create-provedore.dto';

@Controller('provedores')
export class ProvedoresController {
  constructor(private readonly provedoresService: ProvedoresService) {}

  @Post()
  create(@Body() createProvedoreDto: CreateProvedoreDto) {
    return this.provedoresService.create(createProvedoreDto);
  }

  @Get()
  findAll() {
    return this.provedoresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.provedoresService.findOne(id);
  }
}
