import { Exemplo } from '../entities/exemplo';
import { ExemploAudit } from '../entities/exemplo-audit';
import { CreateExemploDto } from '../dto/create-exemplo.dto';
import { UpdateExemploDto } from '../dto/update-exemplo.dto';
import { EntityId } from 'src/core/architecture/types/enity-id';
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

  findOneEntityById(id?: number, options?: object): Promise<Exemplo>;

  updateEntity<T>(
    id: number,
    updateEntityDto: UpdateExemploDto,
    actionDoneBy?: T,
  ): Promise<Exemplo>;

  removeEntity<T>(id: number, actionDoneBy?: T): Promise<void>;
}
