import { PaginatedList } from './paginated-list';

export interface CrudOperations<Entity, ID, CreateEntityDto> {
  create(createEntityDto: CreateEntityDto, actionDoneBy?: ID): Promise<Entity>;

  findOne<T>(options?: T): Promise<Entity>;

  find<T>(options?: T): Promise<Entity[]>;

  findWithPaginator(
    page: number,
    limit: number,
  ): Promise<PaginatedList<Entity>>;

  update(
    updateEntityDto: Partial<CreateEntityDto>,
    actionDoneBy?: ID,
    actionDescription?: string,
  ): Promise<Entity>;

  softDelete(
    options: Partial<CreateEntityDto>,
    actionDoneBy?: ID,
    actionDescription?: string,
  ): Promise<void>;

  delete(
    options: Partial<CreateEntityDto>,
    actionDoneBy?: ID,
    actionDescription?: string,
  ): Promise<void>;
}
