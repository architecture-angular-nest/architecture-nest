import { Exemplo } from '../entities/exemplo';
import { ExemploAudit } from '../entities/exemplo-audit';
import { CreateExemploDto } from '../dto/create-exemplo.dto';
import { UpdateExemploDto } from '../dto/update-exemplo.dto';
import { EntityId } from './../../core/architecture/types/enity-id.type';
import { CrudWithAuditOperations } from 'src/core/architecture/interfaces/crud-with-audit-operations';

export abstract class IExemploService extends CrudWithAuditOperations<
  Exemplo,
  ExemploAudit,
  EntityId,
  CreateExemploDto
> {
  abstract createEntity<T>(
    createEntityDto: CreateExemploDto,
    actionDoneBy?: T,
  ): Promise<Exemplo>;

  abstract findAllEntity(): Promise<Exemplo[]>;

  abstract findOneEntityById(id?: number, options?: object): Promise<Exemplo>;

  abstract updateEntity<T>(
    id: number,
    updateEntityDto: UpdateExemploDto,
    actionDoneBy?: T,
  ): Promise<Exemplo>;

  abstract removeEntity<T>(id: number, actionDoneBy?: T): Promise<void>;
}
