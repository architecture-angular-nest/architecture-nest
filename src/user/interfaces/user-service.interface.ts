import { User } from '../entities/user';
import { CreateUserDto } from '../dto/create-user.dto';
import { EntityId } from './../../core/architecture/types/enity-id.type';
import { CrudWithAuditOperations } from './../../core/architecture/interfaces/crud-with-audit-operations';
import { UserAudit } from '../entities/user-audit';

export interface IUserService
  extends CrudWithAuditOperations<User, UserAudit, EntityId, CreateUserDto> {
  createEntity(
    createEntityDto: CreateUserDto,
    actionDoneBy?: Express.User,
  ): Promise<User>;
  findOneWithEspacificFildsByEmail(fields: string[], email: string);
}
