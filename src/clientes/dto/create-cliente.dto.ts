import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MinLength,
  IsEmail,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class EnderecoDto {
  @IsString()
  @IsNotEmpty()
  cep: string;

  @IsString()
  @IsNotEmpty()
  rua: string;

  @IsString()
  @IsNotEmpty()
  numero: string;

  @IsString()
  @IsNotEmpty()
  bairro: string;

  @IsString()
  @IsNotEmpty()
  cidade: string;

  @IsString()
  @IsNotEmpty()
  estado: string;

  @IsString()
  @IsOptional()
  complemento?: string;

  @IsString()
  @IsOptional()
  referencia?: string;
}

export class CreateClienteDto {
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  nome: string;

  @IsString()
  @MinLength(11, { message: 'O CPF deve ter no mínimo 11 dígitos' })
  cpf: string;

  @IsString()
  @IsOptional()
  rg?: string;

  @IsString()
  @IsNotEmpty({ message: 'Data de nascimento é obrigatória' })
  data_nascimento: string;

  @IsEmail({}, { message: 'Formato de e-mail inválido' })
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  senha: string;

  @IsString()
  @IsNotEmpty({ message: 'Telefone é obrigatório' })
  telefone: string;

  @IsString()
  @IsOptional()
  telefone_alt?: string;

  @IsObject()
  @ValidateNested()
  @Type(() => EnderecoDto)
  endereco: EnderecoDto;
}
