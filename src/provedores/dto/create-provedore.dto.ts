import { IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';

export class CreateProvedoreDto {
  @IsString()
  @IsNotEmpty()
  nome_fantasia: string;

  @IsString()
  @IsNotEmpty()
  razao_social: string;

  @IsString()
  @IsNotEmpty()
  cnpj: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsOptional()
  telefone?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  logo_url?: string;

  @IsBoolean()
  @IsOptional()
  ativo?: boolean;
}
