import { CreateExemploDto } from '../dto/create-exemplo.dto';
import { ExemploTypeOrm } from '../entities/typeorm/exemplo.entity';
import { EntityId } from 'src/core/architecture/types/enity-id';
import { ExemploAuditTypeOrm } from '../entities/typeorm/exemplo-audit.sentity';
import { CrudWithAuditOperations } from 'src/core/architecture/interfaces/crud-with-audit-operations';

export interface IExemploRepository
  extends CrudWithAuditOperations<
    ExemploTypeOrm,
    ExemploAuditTypeOrm,
    EntityId,
    CreateExemploDto
  > {
  findOneEntityById(id: number): Promise<ExemploTypeOrm>;
}
