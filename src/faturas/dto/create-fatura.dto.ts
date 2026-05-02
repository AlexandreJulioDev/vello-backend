import { IsInt, IsNotEmpty, IsOptional, IsString, IsEnum, IsNumber, IsDateString } from 'class-validator';
import { StatusFatura, MetodoPagamento } from '@prisma/client';

export class CreateFaturaDto {
  @IsInt()
  @IsNotEmpty()
  id_cliente: number;

  @IsInt()
  @IsNotEmpty()
  id_contrato: number;

  @IsNumber()
  @IsNotEmpty()
  valor: number;

  @IsNumber()
  @IsOptional()
  valor_pago?: number;

  @IsDateString()
  @IsNotEmpty()
  data_vencimento: string;

  @IsDateString()
  @IsOptional()
  data_pagamento?: string;

  @IsString()
  @IsNotEmpty()
  mes_referencia: string; // Ex: '05/2026'

  @IsEnum(StatusFatura)
  @IsOptional()
  status?: StatusFatura;

  @IsEnum(MetodoPagamento)
  @IsOptional()
  metodo_pagamento?: MetodoPagamento;

  @IsString()
  @IsOptional()
  pix_copia_cola?: string;

  @IsString()
  @IsOptional()
  link_boleto?: string;

  @IsString()
  @IsOptional()
  id_transacao_gateway?: string;

  @IsString()
  @IsOptional()
  observacoes?: string;
}
