import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProvedoresService } from './provedores.service';
import { CreateProvedoreDto } from './dto/create-provedore.dto';
import { UpdateProvedoreDto } from './dto/update-provedore.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('provedores')
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
  findOne(@Param('id') id: string) {
    return this.provedoresService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProvedoreDto: UpdateProvedoreDto) {
    return this.provedoresService.update(+id, updateProvedoreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.provedoresService.remove(+id);
  }
}
