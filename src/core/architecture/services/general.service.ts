import { HttpException, HttpStatus, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { GeneralEntity } from '../entities/general-entity.entity';
import { UtilityService } from './../../../shared/services/utility.service';
import { AuditEntity } from '../entities/audit-entity.entity';
import { ActionAuditEnum } from '../enums/action-audit.enum';
import { ServiceGeneralOperations } from '../interfaces/general-service-operations';


export abstract class GeneralService<
  Entity extends GeneralEntity,
  EntityToAudit extends AuditEntity,
  ID
> implements ServiceGeneralOperations<Entity, EntityToAudit, ID>{
  @Inject(UtilityService)
  protected readonly utilityService: UtilityService

  constructor(
    @InjectRepository(GeneralEntity)
    protected entityRepository: Repository<Entity>,
    @InjectRepository(AuditEntity)
    protected auditRepository: Repository<EntityToAudit>,
  ) { }

  public async create(
    createEntityDto: Partial<Entity>,
    actionDoneBy?: ID,
  ): Promise<Entity> {
    const entity = this.entityRepository.create(createEntityDto as Entity);

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
        },
        actionDoneBy,
        'Entity registration error',
      );

      throw new HttpException(
        'Ação não realizada erro ao cadastrar log',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async findOne(argument?: object): Promise<Entity> {
    const entity = await this.entityRepository.findOne(argument);

    return entity;
  }

  public async find(argument?: object): Promise<Entity[]> {
    const entity = await this.entityRepository.find(argument);

    return entity;
  }

  public async update(
    updateEntityDto: Partial<Entity>,
    actionDoneBy?: ID,
    actionDescription?: string,
  ): Promise<Entity> {
    const entity = await this.entityRepository.preload(
      updateEntityDto as Entity,
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
      });

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
    argument: object,
    actionDoneBy?: ID,
    actionDescription?: string,
  ): Promise<void> {
    const entity: Entity = await this.entityRepository.findOne(argument);

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
    });

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
    argument: object,
    actionDoneBy?: ID,
    actionDescription?: string,
  ): Promise<void> {
    const entity: Entity = await this.entityRepository.findOne(argument);

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
    });

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
    argument: object,
    actionDoneBy?: ID,
    actionDescription?: string,
  ): Promise<void> {
    const entity: Entity = await this.entityRepository.findOne({
      withDeleted: true,
      ...argument,
    });

    if (!entity) throw new HttpException(
      `Registro não encontrado`,
      HttpStatus.NOT_FOUND
    );

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

  public async findAuditEntities(argument: object): Promise<EntityToAudit[]> {
    const entities: EntityToAudit[] = await this.auditRepository.find(argument);

    return entities;
  }
}
