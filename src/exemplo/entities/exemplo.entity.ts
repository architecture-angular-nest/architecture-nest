import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { GeneralEntity } from '../../core/architecture/entities/general-entity.entity';

@Entity('exemplos')
export class Exemplo extends GeneralEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;
}
