import { PaginatedList } from './paginated-list';
import { CrudOperations } from './crud-operations';

export abstract class CrudWithAuditOperations<
  Entity,
  EntityToAudit,
  ID,
  CreateEntityDto,
> extends CrudOperations<Entity, ID, CreateEntityDto> {
  abstract create(
    createEntityDto: CreateEntityDto,
    actionDoneBy: ID,
  ): Promise<Entity>;

  abstract update(
    updateEntityDto: Partial<CreateEntityDto>,
    actionDoneBy: ID,
    actionDescription?: string,
  ): Promise<Entity>;

  abstract softDelete(
    options: Partial<CreateEntityDto>,
    actionDoneBy: ID,
    actionDescription?: string,
  ): Promise<void>;

  abstract delete(
    options: Partial<CreateEntityDto>,
    actionDoneBy: ID,
    actionDescription?: string,
  ): Promise<void>;

  abstract restore<T>(
    options: T,
    actionDoneBy: ID,
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
  ): Promise<any>;

  abstract findEntityLogs(argument?: object): Promise<EntityToAudit[]>;

  abstract undoLastChange(
    entityId: ID,
    actionDoneBy?: ID,
  ): Promise<void | Entity>;
}
