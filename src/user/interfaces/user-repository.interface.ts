import { CreateUserDto } from '../dto/create-user.dto';
import { EntityId } from '../../core/architecture/types/enity-id.type';
import { CrudWithAuditOperations } from '../../core/architecture/interfaces/crud-with-audit-operations';

export interface IUserRepository<T, K>
  extends CrudWithAuditOperations<T, K, EntityId, CreateUserDto> {
  findByEmail(email: string): Promise<T>;
  findOneWithEspacificFildsByEmail(fields: object, email: string): Promise<T>;
}
