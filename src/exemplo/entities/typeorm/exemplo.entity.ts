import { Exemplo } from '../exemplo';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { GeneralEntityTypeOrm } from '../../../core/architecture/entities/typeorm/general-entity.entity';

@Entity('exemplos')
export class ExemploTypeOrm extends GeneralEntityTypeOrm implements Exemplo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;
}
