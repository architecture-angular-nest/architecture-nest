import { EntityBase } from './../../core/architecture/entities/entity-base.entity';

export class User extends EntityBase {
  name: string;
  email: string;
  password: string;
}
