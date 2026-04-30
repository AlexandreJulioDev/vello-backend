import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePlanoDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsNumber()
  velocidade: number;

  @IsNumber()
  preco: number;

  @IsNumber()
  @IsNotEmpty()
  id_provedor: number; // Adicionado para vincular o plano à empresa (ex: PHNET)
}