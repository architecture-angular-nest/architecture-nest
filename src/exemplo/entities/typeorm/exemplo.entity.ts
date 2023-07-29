import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { GeneralEntity } from '../../../core/architecture/entities/typeorm/general-entity.entity';
import { Exemplo } from '../exemplo';

@Entity('exemplos')
export class ExemploTypeOrm extends GeneralEntity implements Exemplo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;
}
