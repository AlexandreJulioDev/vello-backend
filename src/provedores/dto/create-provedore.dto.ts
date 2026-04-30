import { IsNotEmpty, IsOptional, IsString, IsHexColor } from 'class-validator';

export class CreateProvedoreDto {
  @IsString()
  @IsNotEmpty()
  nome_fantasia: string;

  @IsString()
  @IsNotEmpty()
  cnpj: string;

  @IsString()
  @IsNotEmpty()
  slug: string; // Ex: "phnet" ou "novix"

  @IsString()
  @IsOptional()
  logo_url?: string;

  @IsHexColor()
  @IsOptional()
  cor_principal?: string; // Ex: #1F6F9B
}
