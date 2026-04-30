import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUsuarioDto {
  @ApiProperty({ example: 'Felipe Silva' })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({ example: 'felipe@phnet.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @MinLength(6)
  senha: string;

  @ApiProperty({ example: 'ADMINISTRADOR' })
  // Removi o IsEnum temporariamente para aceitar string, ou use o Enum do Prisma
  @IsString() 
  perfil: any; // Usamos any aqui para facilitar a conversão com o Prisma Enum

  @ApiProperty({ example: 1 })
  @IsNumber()
  id_provedor: number;
}
