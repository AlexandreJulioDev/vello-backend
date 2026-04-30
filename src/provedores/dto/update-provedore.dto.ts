import { PartialType } from '@nestjs/mapped-types';
import { CreateProvedoreDto } from './create-provedore.dto';

export class UpdateProvedoreDto extends PartialType(CreateProvedoreDto) {}
