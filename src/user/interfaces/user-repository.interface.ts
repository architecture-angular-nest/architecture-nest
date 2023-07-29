import { CreateUserDto } from '../dto/create-user.dto';
import { EntityId } from '../../core/architecture/types/enity-id.type';
import { CrudWithAuditOperations } from '../../core/architecture/interfaces/crud-with-audit-operations';
import { User } from '../entities/user';
import { UserAudit } from '../entities/user-audit';

export interface IUserRepository
  extends CrudWithAuditOperations<User, UserAudit, EntityId, CreateUserDto> {
  findByEmail(email: string): Promise<User>;
  findOneWithEspacificFildsByEmail(
    fields: object,
    email: string,
  ): Promise<User>;
}
