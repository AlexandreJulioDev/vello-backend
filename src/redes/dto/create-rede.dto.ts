import { IsInt, IsNotEmpty, IsOptional, IsString, IsEnum } from 'class-validator';
import { StatusRede, TipoPontoRede } from '@prisma/client';

export class CreateRotaDto {
  @IsString()
  @IsNotEmpty()
  nome_rota: string;

  @IsString()
  @IsOptional()
  descricao?: string;

  @IsString()
  @IsOptional()
  ponto_referencia?: string;

  @IsEnum(StatusRede)
  @IsOptional()
  status?: StatusRede;
}

export class CreatePontoDto {
  @IsInt()
  @IsNotEmpty()
  id_rota: number;

  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsEnum(TipoPontoRede)
  @IsNotEmpty()
  tipo: TipoPontoRede;

  @IsInt()
  @IsOptional()
  portas_total?: number;

  @IsInt()
  @IsOptional()
  portas_livres?: number;

  @IsEnum(StatusRede)
  @IsOptional()
  status?: StatusRede;

  @IsString()
  @IsOptional()
  endereco_ref?: string;
}
