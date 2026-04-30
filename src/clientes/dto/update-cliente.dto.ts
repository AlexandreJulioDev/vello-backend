import { PartialType } from '@nestjs/mapped-types';
import { CreateClienteDto } from './create-cliente.dto';

// 'PartialType' é um utilitário poderoso: ele herda todos os campos do CreateClienteDto,
// mas transforma todos eles em OPCIONAIS automaticamente.
// Isso é ideal para o método PATCH (atualização parcial).
export class UpdateClienteDto extends PartialType(CreateClienteDto) {}
