import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NotificacoesService } from './notificacoes.service';
import { CreateNotificacaoDto } from './dto/create-notificacao.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('notificacoes')
export class NotificacoesController {
  constructor(private readonly notificacoesService: NotificacoesService) {}

  @Post()
  create(@Body() createNotificacaoDto: CreateNotificacaoDto, @Request() req) {
    return this.notificacoesService.create(createNotificacaoDto, req.user.id_provedor);
  }

  @Get()
  findAll(@Request() req) {
    return this.notificacoesService.findAll(req.user.id_provedor);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.notificacoesService.findOne(+id, req.user.id_provedor);
  }
}
