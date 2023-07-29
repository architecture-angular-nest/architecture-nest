import { Column, Entity } from 'typeorm';
import { GeneralEntityTypeOrm } from './../../core/architecture/entities/typeorm/general-entity.entity';

@Entity('users')
export class User extends GeneralEntityTypeOrm {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;
}
