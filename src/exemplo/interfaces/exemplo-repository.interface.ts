import { CreateExemploDto } from '../dto/create-exemplo.dto';
import { EntityId } from 'src/core/architecture/types/enity-id';
import { CrudWithAuditOperations } from 'src/core/architecture/interfaces/crud-with-audit-operations';
import { Exemplo } from '../entities/exemplo';
import { ExemploAudit } from '../entities/exemplo-audit';

export interface IExemploRepository
  extends CrudWithAuditOperations<
    Exemplo,
    ExemploAudit,
    EntityId,
    CreateExemploDto
  > {
  findOneEntityById(id: number): Promise<Exemplo>;
}
