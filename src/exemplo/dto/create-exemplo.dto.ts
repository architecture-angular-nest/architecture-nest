import { IsString } from 'class-validator';

export class CreateExemploDto {
  @IsString()
  description: string;

  @IsString()
  status: string;
}
