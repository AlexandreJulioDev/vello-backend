import { IsInt, IsNotEmpty, IsOptional, IsString, IsEnum, IsBoolean, IsDateString } from 'class-validator';
import { TipoEquipamento } from '@prisma/client';

export class CreateEquipamentoDto {
  @IsInt()
  @IsNotEmpty()
  id_contrato: number;

  @IsEnum(TipoEquipamento)
  @IsNotEmpty()
  tipo: TipoEquipamento;

  @IsString()
  @IsOptional()
  marca?: string;

  @IsString()
  @IsOptional()
  modelo?: string;

  @IsString()
  @IsOptional()
  numero_serie?: string;

  @IsString()
  @IsOptional()
  mac_address?: string;

  @IsDateString()
  @IsOptional()
  instalado_em?: string;

  @IsBoolean()
  @IsOptional()
  ativo?: boolean;

  @IsString()
  @IsOptional()
  observacoes?: string;
}
