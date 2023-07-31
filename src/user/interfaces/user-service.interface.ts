import { User } from '../entities/user';
import { UserAudit } from '../entities/user-audit';
import { CreateUserDto } from '../dto/create-user.dto';
import { EntityId } from './../../core/architecture/types/enity-id.type';
import { CrudWithAuditOperations } from './../../core/architecture/interfaces/crud-with-audit-operations';

export abstract class IUserService extends CrudWithAuditOperations<
  User,
  UserAudit,
  EntityId,
  CreateUserDto
> {
  abstract createEntity(
    createEntityDto: CreateUserDto,
    actionDoneBy?: Express.User,
  ): Promise<User>;
  abstract findOneWithEspacificFildsByEmail(fields: string[], email: string);
}
