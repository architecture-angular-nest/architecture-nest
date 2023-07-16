import { CrudOperations } from '../interfaces/crud-operations';
import { PaginatedList } from '../interfaces/paginated-list';

export abstract class GeneralWithAuditRepository<
  Entity,
  EntityToAudit,
  ID,
  CreateEntityDto,
> implements CrudOperations<Entity, ID, CreateEntityDto>
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
    actionDescription?: string,
  ): Promise<Entity>;

  abstract softDelete<T>(
    options?: T,
    actionDoneBy?: ID,
    actionDescription?: string,
  ): Promise<void>;

  abstract delete<T>(
    options?: T,
    actionDoneBy?: ID,
    actionDescription?: string,
  ): Promise<void>;

  abstract restore<T>(
    options?: T,
    actionDoneBy?: ID,
    actionDescription?: string,
  ): Promise<Entity>;

  abstract logChange(
    action: string,
    actionDoneBy: ID,
    entityId: number,
    oldValue: object,
    newValue: object,
    actionDescription?: string,
  ): Promise<void>;

  abstract findAuditEntities<T>(options?: T): Promise<EntityToAudit[]>;

  abstract findOneEntityLogsWithPaginator(
    entityId: ID,
    page: number,
    limit: number,
  ): Promise<PaginatedList<EntityToAudit>>;

  abstract findOneEntityLogs(entityId: ID): Promise<EntityToAudit[]>;

  abstract findEntityLogsWithPaginator(
    page: number,
    limit: number,
  ): Promise<PaginatedList<EntityToAudit>>;

  abstract findEntityLogs(argument?: object): Promise<EntityToAudit[]>;

  abstract undoLastChange(
    entityId: ID,
    actionDoneBy?: ID,
  ): Promise<void | Entity>;
}
