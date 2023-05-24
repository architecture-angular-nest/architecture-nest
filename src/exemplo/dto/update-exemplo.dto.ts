import { PartialType } from '@nestjs/mapped-types';
import { CreateExemploDto } from './create-exemplo.dto';

export class UpdateExemploDto extends PartialType(CreateExemploDto) {}
