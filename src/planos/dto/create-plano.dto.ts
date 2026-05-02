import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreatePlanoDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsNumber()
  velocidade_down: number;

  @IsNumber()
  velocidade_up: number;

  @IsNumber()
  preco: number;

  @IsString()
  @IsOptional()
  descricao?: string;

  @IsNumber()
  @IsOptional()
  fidelidade_meses?: number;

  @IsNumber()
  @IsOptional()
  portas_consumidas?: number;

  @IsBoolean()
  @IsOptional()
  banda_compartilhada?: boolean;

  @IsBoolean()
  @IsOptional()
  ativo?: boolean;
}