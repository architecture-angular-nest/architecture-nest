import { PaginatedList } from './paginated-list';

export abstract class CrudOperations<Entity, ID, CreateEntityDto> {
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
    actionDescription?: string,
  ): Promise<Entity>;

  abstract softDelete(
    options: Partial<CreateEntityDto>,
    actionDoneBy?: ID,
    actionDescription?: string,
  ): Promise<void>;

  abstract delete(
    options: Partial<CreateEntityDto>,
    actionDoneBy?: ID,
    actionDescription?: string,
  ): Promise<void>;
}
