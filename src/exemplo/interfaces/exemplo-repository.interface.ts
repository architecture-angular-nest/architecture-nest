import { Exemplo } from '../entities/exemplo';
import { ExemploAudit } from '../entities/exemplo-audit';
import { CreateExemploDto } from '../dto/create-exemplo.dto';
import { EntityId } from './../../core/architecture/types/enity-id.type';
import { CrudWithAuditOperations } from 'src/core/architecture/interfaces/crud-with-audit-operations';

export abstract class IExemploRepository extends CrudWithAuditOperations<
  Exemplo,
  ExemploAudit,
  EntityId,
  CreateExemploDto
> {
  abstract findOneEntityById(id: number): Promise<Exemplo>;
}
