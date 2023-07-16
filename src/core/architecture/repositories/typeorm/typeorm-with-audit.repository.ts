import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Inject } from '@nestjs/common';

import {
  DeepPartial,
  EntityManager,
  FindManyOptions,
  FindOneOptions,
  FindOptionsOrder,
  FindOptionsSelect,
  FindOptionsSelectByString,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { AuditEntity } from '../../entities/typeorm/audit-entity.entity';
import { ActionAuditEnum } from '../../enums/action-audit.enum';
import { PaginatedList } from '../../interfaces/paginated-list';
import { UtilityService } from '../../../../shared/services/utility.service';
import { RepositoryWithAuditOperations } from '../../interfaces/reapository-with-audit-operations';
import { GeneralEntity } from '../../entities/typeorm/general-entity.entity';

export abstract class TypeOrmWithAuditRepository<
  Entity extends GeneralEntity,
  EntityToAudit extends AuditEntity,
  ID,
  CreateEntityDto,
> implements
    RepositoryWithAuditOperations<Entity, EntityToAudit, ID, CreateEntityDto>
{
  @Inject(UtilityService)
  protected readonly utilityService: UtilityService;

  constructor(
    protected entityRepository: Repository<Entity>,
    protected auditRepository: Repository<EntityToAudit>,
  ) {}

  public async create(
    createEntityDto: CreateEntityDto,
    actionDoneBy?: ID,
  ): Promise<Entity> {
    return await this.entityRepository.manager.transaction(
      async (entityManager: EntityManager): Promise<Entity> => {
        const entity = this.entityRepository.create(
          createEntityDto as DeepPartial<Entity>,
        );
        const savedEntity = await entityManager.save(entity);
        await this.logChange(
          ActionAuditEnum.CREATE,
          actionDoneBy,
          savedEntity.id,
          null,
          savedEntity as object,
        );

        return savedEntity;
      },
    );
  }

  public async findOne(options?: FindOneOptions<Entity>): Promise<Entity> {
    const entity = await this.entityRepository.findOne(options);

    return entity;
  }

  public async find(options?: FindManyOptions<Entity>): Promise<Entity[]> {
    const entity = await this.entityRepository.find(options);

    return entity;
  }

  public async findWithPaginator(
    page: number,
    limit: number,
  ): Promise<PaginatedList<Entity>> {
    const [data, total] = await this.entityRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
    });

    return { data, total };
  }

  public async update(
    updateEntityDto: Partial<CreateEntityDto>,
    actionDoneBy?: ID,
    actionDescription?: string,
  ): Promise<Entity> {
    return await this.entityRepository.manager.transaction(
      async (entityManager: EntityManager): Promise<Entity> => {
        const entity = await this.entityRepository.preload(
          updateEntityDto as unknown as DeepPartial<Entity>,
        );

        if (!entity)
          throw new HttpException(
            `Registro não encontrado`,
            HttpStatus.NOT_FOUND,
          );

        const lastChange: EntityToAudit[] = await this.findAuditEntities({
          order: {
            timestamp: 'DESC',
          },
          where: {
            entityId: entity.id,
          },
          take: 5,
        } as FindManyOptions<EntityToAudit>);

        await this.logChange(
          ActionAuditEnum.UPDATE,
          actionDoneBy,
          entity.id,
          lastChange.length > 0
            ? {
                ...lastChange[0].newValue,
              }
            : null,
          entity as object,
          actionDescription,
        );
        const updatedEntity = entityManager.save(entity);

        return updatedEntity;
      },
    );
  }

  public async softDelete(
    options: FindOneOptions<Entity>,
    actionDoneBy?: ID,
    actionDescription?: string,
  ): Promise<void> {
    return await this.entityRepository.manager.transaction(
      async (entityManager: EntityManager): Promise<void> => {
        const entity: Entity = await this.entityRepository.findOne(options);

        if (!entity)
          throw new HttpException(
            `Registro não encontrado`,
            HttpStatus.NOT_FOUND,
          );

        const lastChange: EntityToAudit[] = await this.findAuditEntities({
          order: {
            timestamp: 'DESC',
          },
          where: {
            entityId: entity.id,
          },
          take: 5,
        } as FindManyOptions<EntityToAudit>);

        entity.status = 'DELETED';
        entity.deleted_at =
          this.utilityService.returnStringDateWithBrazilianTimeZone();
        const newValue = await entityManager.save(entity);
        await this.logChange(
          ActionAuditEnum.SOFTDELETE,
          actionDoneBy,
          entity.id,
          lastChange.length > 0
            ? {
                ...lastChange[0].newValue,
              }
            : null,
          newValue as object,
          actionDescription,
        );
      },
    );
  }

  public async delete(
    options: FindOneOptions<Entity>,
    actionDoneBy?: ID,
    actionDescription?: string,
  ): Promise<void> {
    return await this.entityRepository.manager.transaction(
      async (entityManager: EntityManager): Promise<void> => {
        const entity: Entity = await this.entityRepository.findOne(options);

        if (!entity)
          throw new HttpException(
            `Registro não encontrado`,
            HttpStatus.NOT_FOUND,
          );

        await entityManager.remove(entity);
        const lastChange: EntityToAudit[] = await this.findAuditEntities({
          order: {
            timestamp: 'DESC',
          },
          where: {
            entityId: entity.id,
          },
          take: 5,
        } as FindManyOptions<EntityToAudit>);

        await this.logChange(
          ActionAuditEnum.DELETE,
          actionDoneBy,
          entity.id,
          lastChange.length > 0
            ? {
                ...lastChange[0].newValue,
              }
            : null,
          entity as object,
          actionDescription,
        );
      },
    );
  }

  public async restore(
    options: FindOneOptions<Entity>,
    actionDoneBy?: ID,
    actionDescription?: string,
  ): Promise<Entity> {
    return await this.entityRepository.manager.transaction(
      async (entityManager: EntityManager): Promise<Entity> => {
        const entity: Entity = await this.entityRepository.findOne({
          withDeleted: true,
          ...options,
        });

        if (!entity)
          throw new HttpException(
            `Registro não encontrado`,
            HttpStatus.NOT_FOUND,
          );

        entity.status = 'ACTIVE';
        entity.deleted_at = null;
        const newValue = await entityManager.save(entity);
        await this.logChange(
          ActionAuditEnum.RESTORE,
          actionDoneBy,
          entity.id,
          entity as object,
          newValue as object,
          actionDescription,
        );

        return newValue;
      },
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
    await this.auditRepository.manager.transaction(
      async (entiyManager: EntityManager) => {
        const entityAudit = this.auditRepository.create({
          action: action,
          actionDoneBy: actionDoneBy as number,
          entityId: entityId,
          oldValue: !!oldValue ? oldValue : null,
          newValue: !!newValue ? newValue : null,
          actionDescription: actionDescription,
          timestamp:
            this.utilityService.returnStringDateWithBrazilianTimeZone(),
        } as DeepPartial<EntityToAudit>);
        await entiyManager.save(entityAudit as EntityToAudit);
      },
    );
  }

  public async findAuditEntities(
    options?: FindManyOptions<EntityToAudit>,
  ): Promise<EntityToAudit[]> {
    const entities: EntityToAudit[] = await this.auditRepository.find(options);

    return entities;
  }

  public async findOneEntityLogsWithPaginator(
    entityId: ID,
    page: number,
    limit: number,
  ): Promise<PaginatedList<EntityToAudit>> {
    const [data, total] = await this.auditRepository.findAndCount({
      select: {
        id: true,
        action: true,
        actionDescription: true,
        actionDoneBy: true,
        entityId: true,
        timestamp: true,
      } as
        | FindOptionsSelect<EntityToAudit>
        | FindOptionsSelectByString<EntityToAudit>,
      take: limit,
      skip: (page - 1) * limit,
      where: { entityId: entityId } as
        | FindOptionsWhere<EntityToAudit>
        | FindOptionsWhere<EntityToAudit>[],
    });

    return { data, total };
  }

  public async findOneEntityLogs(entityId: ID): Promise<EntityToAudit[]> {
    return this.auditRepository.find({
      select: {
        id: true,
        action: true,
        actionDescription: true,
        actionDoneBy: true,
        entityId: true,
        timestamp: true,
      } as
        | FindOptionsSelect<EntityToAudit>
        | FindOptionsSelectByString<EntityToAudit>,
      where: { entityId: entityId } as
        | FindOptionsWhere<EntityToAudit>
        | FindOptionsWhere<EntityToAudit>[],
    });
  }

  public async findEntityLogsWithPaginator(
    page: number,
    limit: number,
  ): Promise<PaginatedList<EntityToAudit>> {
    const [data, total] = await this.auditRepository.findAndCount({
      select: {
        id: true,
        action: true,
        actionDescription: true,
        actionDoneBy: true,
        entityId: true,
        timestamp: true,
      } as
        | FindOptionsSelect<EntityToAudit>
        | FindOptionsSelectByString<EntityToAudit>,
      take: limit,
      skip: (page - 1) * limit,
    });

    return { data, total };
  }

  public async findEntityLogs(argument?: object): Promise<EntityToAudit[]> {
    return this.auditRepository.find({
      ...argument,
      select: {
        id: true,
        action: true,
        actionDescription: true,
        actionDoneBy: true,
        entityId: true,
        timestamp: true,
      } as
        | FindOptionsSelect<EntityToAudit>
        | FindOptionsSelectByString<EntityToAudit>,
    });
  }

  public async undoLastChange(
    entityId: ID,
    actionDoneBy?: ID,
  ): Promise<void | Entity> {
    const lastChange: EntityToAudit[] = await this.findAuditEntities({
      order: {
        timestamp: 'DESC',
      } as FindOptionsOrder<EntityToAudit>,
      where: {
        entityId: entityId,
      } as FindOptionsWhere<EntityToAudit> | FindOptionsWhere<EntityToAudit>[],
      take: 5,
    });
    const entityThatWasDeleted: boolean =
      lastChange[0].action === ActionAuditEnum.DELETE;

    if (entityThatWasDeleted)
      throw new HttpException(
        `Entity permanently deleted, there is no recovery.`,
        HttpStatus.NOT_FOUND,
      );

    const entityThatWasSoftDeleted: boolean =
      lastChange[0].action === ActionAuditEnum.SOFTDELETE;

    if (entityThatWasSoftDeleted)
      return this.restoreEntity(
        {
          where: {
            id: lastChange[0].oldValue['id'],
          },
        },
        actionDoneBy,
      );

    return this.update(
      { ...lastChange[0].oldValue },
      actionDoneBy,
      'last change undone',
    );
  }

  private async restoreEntity(argument: object, actionDoneBy?: ID) {
    return this.restore(argument, actionDoneBy, 'Restore Entity');
  }
}
