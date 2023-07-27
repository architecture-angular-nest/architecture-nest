import { CreateExemploDto } from '../dto/create-exemplo.dto';
import { UpdateExemploDto } from '../dto/update-exemplo.dto';
import { Exemplo } from '../entities/typeorm/exemplo.schema';
import { EntityId } from 'src/core/architecture/types/enity-id';
import { ExemploAudit } from '../entities/typeorm/exemplo-audit.schema';
import { CrudWithAuditOperations } from 'src/core/architecture/interfaces/crud-with-audit-operations';

export interface IExemploService
  extends CrudWithAuditOperations<
    Exemplo,
    ExemploAudit,
    EntityId,
    CreateExemploDto
  > {
  createEntity<T>(
    createEntityDto: CreateExemploDto,
    actionDoneBy?: T,
  ): Promise<Exemplo>;

  findAllEntity(): Promise<Exemplo[]>;

  findOneEntity(id?: number, options?: object): Promise<Exemplo>;

  updateEntity<T>(
    id: number,
    updateEntityDto: UpdateExemploDto,
    actionDoneBy?: T,
  ): Promise<Exemplo>;

  removeEntity<T>(id: number, actionDoneBy?: T): Promise<void>;
}
