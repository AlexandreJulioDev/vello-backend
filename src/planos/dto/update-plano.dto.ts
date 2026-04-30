import { PartialType } from '@nestjs/mapped-types';
import { CreatePlanoDto } from './create-plano.dto';

// Permite que todos os campos sejam opcionais na hora de editar (PATCH)
export class UpdatePlanoDto extends PartialType(CreatePlanoDto) {}
