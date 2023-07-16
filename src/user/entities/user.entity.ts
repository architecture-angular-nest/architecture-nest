import { Column, Entity } from 'typeorm';
import { GeneralEntity } from './../../core/architecture/entities/typeorm/general-entity.entity';

@Entity('users')
export class User extends GeneralEntity {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;
}
