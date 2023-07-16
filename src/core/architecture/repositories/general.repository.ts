import { GeneralEntity } from '../entities/typeorm/general-entity.entity';
import { CrudOperations } from '../interfaces/crud-operations';
import { PaginatedList } from '../interfaces/paginated-list';

export abstract class GeneralRepository<Entity, ID, CreateEntityDto>
  implements CrudOperations<Entity, ID, CreateEntityDto>
{
  abstract create(
    createEntityDto: CreateEntityDto,
    actionDoneBy?: ID,
  ): Promise<Entity>;

  abstract findOne<T>(options?: T): Promise<Entity>;

  abstract find<T>(options?: T): Promise<Entity[]>;

  abstract findWithPaginator(
    page: number,
    limit: number,
  ): Promise<PaginatedList<Entity>>;

  abstract update(
    updateEntityDto: Partial<CreateEntityDto>,
    actionDoneBy?: ID,
  ): Promise<Entity>;

  abstract softDelete<T>(options: T, actionDoneBy?: ID): Promise<void>;

  abstract delete<T>(options: T): Promise<void>;
}
