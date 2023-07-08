import { HttpException, HttpStatus, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsOrder,
  FindOptionsSelect,
  FindOptionsSelectByString,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { GeneralEntity } from '../entities/general-entity.entity';
import { UtilityService } from './../../../shared/services/utility.service';
import { AuditEntity } from '../entities/audit-entity.entity';
import { ActionAuditEnum } from '../enums/action-audit.enum';
import { ServiceGeneralOperations } from '../interfaces/general-service-operations';
import { PaginatedList } from '../interfaces/paginated-list';

export abstract class GeneralService<
  Entity extends GeneralEntity,
  EntityToAudit extends AuditEntity,
  ID,
  CreateEntityDto,
> implements
    ServiceGeneralOperations<Entity, EntityToAudit, ID, CreateEntityDto>
{
  @Inject(UtilityService)
  protected readonly utilityService: UtilityService;

  constructor(
    @InjectRepository(GeneralEntity)
    protected entityRepository: Repository<Entity>,
    @InjectRepository(AuditEntity)
    protected auditRepository: Repository<EntityToAudit>,
  ) {}

  public async create(
    createEntityDto: CreateEntityDto,
    actionDoneBy?: ID,
  ): Promise<Entity> {
    const entity = this.entityRepository.create(
      createEntityDto as DeepPartial<Entity>,
    );
    const savedEntity = await this.entityRepository.save(entity);

    try {
      await this.logChange(
        ActionAuditEnum.CREATE,
        actionDoneBy,
        savedEntity.id,
        null,
        savedEntity as object,
      );

      return savedEntity;
    } catch (error) {
      this.softDelete(
        {
          where: {
            id: savedEntity.id,
          },
        } as FindOneOptions<Entity>,
        actionDoneBy,
        'Entity registration error',
      );

      throw new HttpException(
        'Ação não realizada erro ao cadastrar log',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async findOne(options?: FindOneOptions<Entity>): Promise<Entity> {
    const entity = await this.entityRepository.findOne(options);

    return entity;
  }

  public async find(options?: FindManyOptions<Entity>): Promise<Entity[]> {
    const entity = await this.entityRepository.find(options);

    return entity;
  }

  public async update(
    updateEntityDto: Partial<CreateEntityDto>,
    actionDoneBy?: ID,
    actionDescription?: string,
  ): Promise<Entity> {
    const entity = await this.entityRepository.preload(
      updateEntityDto as unknown as DeepPartial<Entity>,
    );

    if (!entity)
      throw new HttpException(`Registro não encontrado`, HttpStatus.NOT_FOUND);

    try {
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
    } catch (error) {
      throw new HttpException(
        'Ação não realizada erro ao cadastrar log',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const updatedEntity = this.entityRepository.save(entity);

    return updatedEntity;
  }

  public async softDelete(
    options: FindOneOptions<Entity>,
    actionDoneBy?: ID,
    actionDescription?: string,
  ): Promise<void> {
    const entity: Entity = await this.entityRepository.findOne(options);

    if (!entity)
      throw new HttpException(`Registro não encontrado`, HttpStatus.NOT_FOUND);

    const lastChange: EntityToAudit[] = await this.findAuditEntities({
      order: {
        timestamp: 'DESC',
      },
      where: {
        entityId: entity.id,
      },
      take: 5,
    } as FindManyOptions<EntityToAudit>);

    try {
      entity.status = 'DELETED';
      entity.deleted_at =
        this.utilityService.returnStringDateWithBrazilianTimeZone();
      const newValue = await this.entityRepository.save(entity);
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
    } catch (error) {
      throw new HttpException(
        'Ação não realizada erro ao cadastrar log',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async delete(
    options: FindOneOptions<Entity>,
    actionDoneBy?: ID,
    actionDescription?: string,
  ): Promise<void> {
    const entity: Entity = await this.entityRepository.findOne(options);

    if (!entity)
      throw new HttpException(`Registro não encontrado`, HttpStatus.NOT_FOUND);

    const lastChange: EntityToAudit[] = await this.findAuditEntities({
      order: {
        timestamp: 'DESC',
      },
      where: {
        entityId: entity.id,
      },
      take: 5,
    } as FindManyOptions<EntityToAudit>);

    try {
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
      await this.entityRepository.remove(entity);
    } catch (error) {
      throw new HttpException(
        'Ação não realizada erro ao cadastrar log',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async restore(
    options: FindOneOptions<Entity>,
    actionDoneBy?: ID,
    actionDescription?: string,
  ): Promise<Entity> {
    const entity: Entity = await this.entityRepository.findOne({
      withDeleted: true,
      ...options,
    });

    if (!entity)
      throw new HttpException(`Registro não encontrado`, HttpStatus.NOT_FOUND);

    try {
      entity.status = 'ACTIVE';
      entity.deleted_at = null;
      const newValue = await this.entityRepository.save(entity);
      await this.logChange(
        ActionAuditEnum.RESTORE,
        actionDoneBy,
        entity.id,
        entity as object,
        newValue as object,
        actionDescription,
      );

      return newValue;
    } catch (error) {
      throw new HttpException(
        'Ação não realizada erro ao cadastrar log',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async logChange(
    action: string,
    actionDoneBy: ID,
    entityId: number,
    oldValue: object,
    newValue: object,
    actionDescription?: string,
  ): Promise<void> {
    const entityAudit = new AuditEntity();
    entityAudit.action = action;
    entityAudit.actionDoneBy = actionDoneBy as number;
    entityAudit.entityId = entityId;
    entityAudit.oldValue = !!oldValue ? oldValue : null;
    entityAudit.newValue = !!newValue ? newValue : null;
    entityAudit.actionDescription = actionDescription;
    entityAudit.timestamp =
      this.utilityService.returnStringDateWithBrazilianTimeZone();
    await this.auditRepository.save(entityAudit as EntityToAudit);
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
        `Entidade deletada difinivamente, não há recuperação.`,
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
