import { IsInt, IsNotEmpty, IsOptional, IsString, IsEnum } from 'class-validator';
import { CanalNotificacao } from '@prisma/client';

export class CreateNotificacaoDto {
  @IsInt()
  @IsNotEmpty()
  id_cliente: number;

  @IsEnum(CanalNotificacao)
  @IsNotEmpty()
  canal: CanalNotificacao;

  @IsString()
  @IsNotEmpty()
  assunto: string;

  @IsString()
  @IsNotEmpty()
  mensagem: string;
}
