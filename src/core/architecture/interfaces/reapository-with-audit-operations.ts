import { PaginatedList } from './paginated-list';
import { RepositoryOperations } from './reapository-operations';

export interface RepositoryWithAuditOperations<
  Entity,
  EntityToAudit,
  ID,
  CreateEntityDto,
> extends RepositoryOperations<Entity, ID, CreateEntityDto> {
  restore<T>(
    options: T,
    actionDoneBy?: ID,
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
