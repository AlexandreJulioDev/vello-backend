import { IsInt, IsNotEmpty, IsOptional, IsDateString, IsEnum, IsString } from 'class-validator';
import { StatusContrato } from '@prisma/client';

export class CreateContratoDto {
  @IsInt()
  @IsNotEmpty()
  id_cliente: number;

  @IsInt()
  @IsNotEmpty()
  id_plano: number;

  @IsInt()
  @IsOptional()
  id_ponto_rede?: number;

  @IsDateString()
  @IsNotEmpty()
  data_inicio: string;

  @IsDateString()
  @IsOptional()
  data_fim?: string;

  @IsInt()
  @IsOptional()
  dia_vencimento?: number;

  @IsEnum(StatusContrato)
  @IsOptional()
  status?: StatusContrato;

  @IsString()
  @IsOptional()
  observacoes?: string;
}
