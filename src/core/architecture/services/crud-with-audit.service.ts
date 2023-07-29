import { CrudWithAuditOperations } from '../interfaces/crud-with-audit-operations';
import { PaginatedList } from '../interfaces/paginated-list';

export abstract class CrudWithAuditService<
  Entity,
  EntityToAudit,
  ID,
  CreateEntityDto,
> implements
    CrudWithAuditOperations<Entity, EntityToAudit, ID, CreateEntityDto>
{
  constructor(
    protected entityRepository:
      | CrudWithAuditOperations<Entity, EntityToAudit, ID, CreateEntityDto>
      | Promise<
          CrudWithAuditOperations<Entity, EntityToAudit, ID, CreateEntityDto>
        >,
  ) {}

  public async create(
    createEntityDto: CreateEntityDto,
    actionDoneBy: ID,
  ): Promise<Entity> {
    const repository = await this.entityRepository;
    return await repository.create(createEntityDto, actionDoneBy);
  }

  public async findOne(options?: unknown): Promise<Entity> {
    const repository = await this.entityRepository;
    return await repository.findOne(options);
  }

  public async find(options?: unknown): Promise<Entity[]> {
    const repository = await this.entityRepository;
    return await repository.find(options);
  }

  public async findWithPaginator(
    page: number,
    limit: number,
  ): Promise<PaginatedList<Entity>> {
    const repository = await this.entityRepository;
    return await repository.findWithPaginator(limit, page);
  }

  public async update(
    updateEntityDto: Partial<CreateEntityDto>,
    actionDoneBy: ID,
    actionDescription?: string,
  ): Promise<Entity> {
    const repository = await this.entityRepository;
    return await repository.update(
      updateEntityDto,
      actionDoneBy,
      actionDescription,
    );
  }

  public async softDelete(
    options: Partial<CreateEntityDto>,
    actionDoneBy?: ID,
    actionDescription?: string,
  ): Promise<void> {
    const repository = await this.entityRepository;
    return await repository.softDelete(
      options,
      actionDoneBy,
      actionDescription,
    );
  }

  public async delete(
    options: Partial<CreateEntityDto>,
    actionDoneBy?: ID,
    actionDescription?: string,
  ): Promise<void> {
    const repository = await this.entityRepository;
    return await repository.delete(options, actionDoneBy, actionDescription);
  }

  public async restore(
    options: unknown,
    actionDoneBy?: ID,
    actionDescription?: string,
  ): Promise<Entity> {
    const repository = await this.entityRepository;
    return await repository.restore(options, actionDoneBy, actionDescription);
  }

  public async logChange(
    action: string,
    actionDoneBy: ID,
    entityId: number,
    oldValue: object,
    newValue: object,
    actionDescription?: string,
  ): Promise<void> {
    const repository = await this.entityRepository;
    await repository.logChange(
      action,
      actionDoneBy,
      entityId,
      oldValue,
      newValue,
      actionDescription,
    );
  }

  public async findAuditEntities(options?: unknown): Promise<EntityToAudit[]> {
    const repository = await this.entityRepository;
    return await repository.findAuditEntities(options);
  }

  public async findOneEntityLogsWithPaginator(
    entityId: ID,
    page: number,
    limit: number,
  ): Promise<PaginatedList<EntityToAudit>> {
    const repository = await this.entityRepository;
    return await repository.findOneEntityLogsWithPaginator(
      entityId,
      page,
      limit,
    );
  }

  public async findOneEntityLogs(entityId: ID): Promise<EntityToAudit[]> {
    const repository = await this.entityRepository;
    return repository.findOneEntityLogs(entityId);
  }

  public async findEntityLogsWithPaginator(
    page: number,
    limit: number,
  ): Promise<PaginatedList<EntityToAudit>> {
    const repository = await this.entityRepository;
    return await repository.findEntityLogsWithPaginator(limit, page);
  }

  public async findEntityLogs(argument?: object): Promise<EntityToAudit[]> {
    const repository = await this.entityRepository;
    return repository.findEntityLogs(argument);
  }

  public async undoLastChange(
    entityId: ID,
    actionDoneBy?: ID,
  ): Promise<void | Entity> {
    const repository = await this.entityRepository;
    return await repository.undoLastChange(entityId, actionDoneBy);
  }
}
