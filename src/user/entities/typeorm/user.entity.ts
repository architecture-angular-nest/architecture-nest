import { Column, Entity } from 'typeorm';
import { GeneralEntityTypeOrm } from './../../../core/architecture/entities/typeorm/general-entity.entity';
import { User } from '../user';

@Entity('users')
export class UserTypeOrm extends GeneralEntityTypeOrm implements User {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;
}
