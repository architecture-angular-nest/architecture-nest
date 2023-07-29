import { PaginatedList } from './paginated-list';
import { CrudOperations } from './crud-operations';

export interface CrudWithAuditOperations<
  Entity,
  EntityToAudit,
  ID,
  CreateEntityDto,
> extends CrudOperations<Entity, ID, CreateEntityDto> {
  create(createEntityDto: CreateEntityDto, actionDoneBy: ID): Promise<Entity>;

  update(
    updateEntityDto: Partial<CreateEntityDto>,
    actionDoneBy: ID,
    actionDescription?: string,
  ): Promise<Entity>;

  softDelete(
    options: Partial<CreateEntityDto>,
    actionDoneBy: ID,
    actionDescription?: string,
  ): Promise<void>;

  delete(
    options: Partial<CreateEntityDto>,
    actionDoneBy: ID,
    actionDescription?: string,
  ): Promise<void>;

  restore<T>(
    options: T,
    actionDoneBy: ID,
    actionDescription?: string,
  ): Promise<Entity>;

  logChange(
    action: string,
    actionDoneBy: ID,
    entityId: number,
    oldValue: object,
    newValue: object,
    actionDescription?: string,
  ): Promise<void>;

  findAuditEntities<T>(options?: T): Promise<EntityToAudit[]>;

  findOneEntityLogsWithPaginator(
    entityId: ID,
    page: number,
    limit: number,
  ): Promise<PaginatedList<EntityToAudit>>;

  findOneEntityLogs(entityId: ID): Promise<EntityToAudit[]>;

  findEntityLogsWithPaginator(page: number, limit: number): Promise<any>;

  findEntityLogs(argument?: object): Promise<EntityToAudit[]>;

  undoLastChange(entityId: ID, actionDoneBy?: ID): Promise<void | Entity>;
}
