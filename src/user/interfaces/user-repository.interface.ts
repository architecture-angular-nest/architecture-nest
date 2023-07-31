import { CreateUserDto } from '../dto/create-user.dto';
import { EntityId } from '../../core/architecture/types/enity-id.type';
import { CrudWithAuditOperations } from '../../core/architecture/interfaces/crud-with-audit-operations';
import { User } from '../entities/user';
import { UserAudit } from '../entities/user-audit';

export abstract class IUserRepository extends CrudWithAuditOperations<
  User,
  UserAudit,
  EntityId,
  CreateUserDto
> {
  abstract findByEmail(email: string): Promise<User>;
  abstract findOneWithEspacificFildsByEmail(
    fields: object,
    email: string,
  ): Promise<User>;
}
