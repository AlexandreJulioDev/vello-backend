import { IsInt, IsNotEmpty, IsOptional, IsString, IsEnum, IsDateString, Max, Min } from 'class-validator';
import { TipoAtendimento, PrioridadeAtendimento, StatusAtendimento } from '@prisma/client';

export class CreateAtendimentoDto {
  @IsInt()
  @IsNotEmpty()
  id_cliente: number;

  @IsInt()
  @IsOptional()
  id_funcionario?: number;

  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsString()
  @IsNotEmpty()
  descricao: string;

  @IsEnum(TipoAtendimento)
  @IsNotEmpty()
  tipo: TipoAtendimento;

  @IsEnum(PrioridadeAtendimento)
  @IsOptional()
  prioridade?: PrioridadeAtendimento;

  @IsEnum(StatusAtendimento)
  @IsOptional()
  status?: StatusAtendimento;

  @IsDateString()
  @IsOptional()
  data_agendamento?: string;

  @IsDateString()
  @IsOptional()
  finalizado_em?: string;

  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  nota_avaliacao?: number;

  @IsString()
  @IsOptional()
  comentario_cliente?: string;
}
