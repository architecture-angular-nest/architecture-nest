import { AuditEntity } from '../entities/typeorm/audit-entity.entity';
import { GeneralEntity } from '../entities/typeorm/general-entity.entity';
import { CrudWithAuditOperations } from '../interfaces/crud-with-audit-operations';
import { PaginatedList } from '../interfaces/paginated-list';
import { GeneralWithAuditRepository } from '../repositories/general-with-audit.repository';

export abstract class CrudWithAuditService<
  Entity extends GeneralEntity,
  EntityToAudit extends AuditEntity,
  ID,
  CreateEntityDto,
> implements
    CrudWithAuditOperations<Entity, EntityToAudit, ID, CreateEntityDto>
{
  constructor(
    protected entityRepository: GeneralWithAuditRepository<
      Entity,
      EntityToAudit,
      ID,
      CreateEntityDto
    >,
  ) {}

  public async create(
    createEntityDto: CreateEntityDto,
    actionDoneBy: ID,
  ): Promise<Entity> {
    return await this.entityRepository.create(createEntityDto, actionDoneBy);
  }

  public async findOne(options?: unknown): Promise<Entity> {
    return await this.entityRepository.findOne(options);
  }

  public async find(options?: unknown): Promise<Entity[]> {
    return await this.entityRepository.find(options);
  }

  public async findWithPaginator(
    page: number,
    limit: number,
  ): Promise<PaginatedList<Entity>> {
    return await this.entityRepository.findWithPaginator(limit, page);
  }

  public async update(
    updateEntityDto: Partial<CreateEntityDto>,
    actionDoneBy: ID,
    actionDescription?: string,
  ): Promise<Entity> {
    return await this.entityRepository.update(
      updateEntityDto,
      actionDoneBy,
      actionDescription,
    );
  }

  public async softDelete(
    options: unknown,
    actionDoneBy?: ID,
    actionDescription?: string,
  ): Promise<void> {
    return await this.entityRepository.softDelete(
      options,
      actionDoneBy,
      actionDescription,
    );
  }

  public async delete(
    options: unknown,
    actionDoneBy?: ID,
    actionDescription?: string,
  ): Promise<void> {
    return await this.entityRepository.delete(
      options,
      actionDoneBy,
      actionDescription,
    );
  }

  public async restore(
    options: unknown,
    actionDoneBy?: ID,
    actionDescription?: string,
  ): Promise<Entity> {
    return await this.entityRepository.restore(
      options,
      actionDoneBy,
      actionDescription,
    );
  }

  public async logChange(
    action: string,
    actionDoneBy: ID,
    entityId: number,
    oldValue: object,
    newValue: object,
    actionDescription?: string,
  ): Promise<void> {
    await this.entityRepository.logChange(
      action,
      actionDoneBy,
      entityId,
      oldValue,
      newValue,
      actionDescription,
    );
  }

  public async findAuditEntities(options?: unknown): Promise<EntityToAudit[]> {
    return await this.entityRepository.findAuditEntities(options);
  }

  public async findOneEntityLogsWithPaginator(
    entityId: ID,
    page: number,
    limit: number,
  ): Promise<PaginatedList<EntityToAudit>> {
    return await this.entityRepository.findOneEntityLogsWithPaginator(
      entityId,
      page,
      limit,
    );
  }

  public async findOneEntityLogs(entityId: ID): Promise<EntityToAudit[]> {
    return this.entityRepository.findOneEntityLogs(entityId);
  }

  public async findEntityLogsWithPaginator(
    page: number,
    limit: number,
  ): Promise<PaginatedList<EntityToAudit>> {
    return await this.entityRepository.findEntityLogsWithPaginator(limit, page);
  }

  public async findEntityLogs(argument?: object): Promise<EntityToAudit[]> {
    return this.entityRepository.findEntityLogs(argument);
  }

  public async undoLastChange(
    entityId: ID,
    actionDoneBy?: ID,
  ): Promise<void | Entity> {
    return await this.entityRepository.undoLastChange(entityId, actionDoneBy);
  }
}
