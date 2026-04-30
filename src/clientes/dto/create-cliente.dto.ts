import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MinLength,
  IsInt,
  IsEmail,
} from 'class-validator';

/**
 * DTO (Data Transfer Object)
 * Serve para definir o formato dos dados que chegam do Front-end (Insomnia, Site, App).
 */
export class CreateClienteDto {
  
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  nome: string;

  @IsString()
  // Validação para evitar CPFs incompletos
  @MinLength(11, { message: 'O CPF deve ter no mínimo 11 dígitos' })
  cpf: string;

  @IsString()
  @IsNotEmpty({ message: 'Data de nascimento é obrigatória' })
  // Recebemos como String (ex: "1995-10-25") para facilitar o JSON
  data_nascimento: string;

  @IsString()
  @IsNotEmpty({ message: 'Telefone é obrigatório' })
  telefone: string;

  @IsString()
  @IsNotEmpty({ message: 'Endereço é obrigatório' })
  endereco: string;

  @IsOptional() // O e-mail não é obrigatório no seu banco
  @IsEmail({}, { message: 'Formato de e-mail inválido' })
  email?: string;

  @IsInt({ message: 'O ID do provedor deve ser um número inteiro' })
  @IsNotEmpty({ message: 'O vínculo com o provedor é obrigatório' })
  /** 
   * ESSENCIAL PARA SAAS:
   * Define a qual empresa esse cliente pertence (ex: ID 1 para PHNET).
   */
  id_provedor: number;

  @IsOptional()
  @IsInt({ message: 'O ID do plano deve ser um número inteiro' })
  // Vincula o cliente a um plano de internet específico
  id_plano?: number;
}
