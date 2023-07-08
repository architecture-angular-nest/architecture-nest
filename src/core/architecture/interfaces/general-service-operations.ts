import { FindManyOptions, FindOneOptions } from 'typeorm';
import { PaginatedList } from './paginated-list';

export interface ServiceGeneralOperations<
  Entity,
  EntityToAudit,
  ID,
  CreateEntityDto,
> {
  create(createEntityDto: CreateEntityDto, actionDoneBy?: ID): Promise<Entity>;

  findOne(options?: FindOneOptions<Entity>): Promise<Entity>;

  update(
    updateEntityDto: Partial<CreateEntityDto>,
    actionDoneBy?: ID,
    actionDescription?: string,
  ): Promise<Entity>;

  softDelete(
    options: FindOneOptions<Entity>,
    actionDoneBy?: ID,
    actionDescription?: string,
  ): Promise<void>;

  delete(
    options: FindOneOptions<Entity>,
    actionDoneBy?: ID,
    actionDescription?: string,
  ): Promise<void>;

  restore(
    options: FindOneOptions<Entity>,
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

  findAuditEntities(
    options?: FindManyOptions<EntityToAudit>,
  ): Promise<EntityToAudit[]>;

  findOneEntityLogsWithPaginator(
    entityId: ID,
    page: number,
    limit: number,
  ): Promise<PaginatedList<EntityToAudit>>;

  findOneEntityLogs(entityId: ID): Promise<EntityToAudit[]>;

  findEntityLogsWithPaginator(
    page: number,
    limit: number,
  ): Promise<PaginatedList<EntityToAudit>>;

  findEntityLogs(argument?: object): Promise<EntityToAudit[]>;

  undoLastChange(entityId: ID, actionDoneBy?: ID): Promise<void | Entity>;
}
