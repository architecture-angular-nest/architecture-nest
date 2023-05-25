import { HttpException, HttpStatus, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { GeneralEntity } from '../entities/general-entity.entity';
import { UtilityService } from './../../../shared/services/utility.service';
import { AuditEntity } from '../entities/audit-entity.entity';
import { ActionAuditEnum } from '../enums/action-audit.enum';


export abstract class GeneralService<
  Entity extends GeneralEntity,
  EntityToAudit extends AuditEntity,
> {
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
    actionDoneBy?: number,
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
    actionDoneBy?: number,
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
    actionDoneBy?: number,
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
        ActionAuditEnum.SOFTDELETE,
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

    entity.status = 'DELETED';
    entity.deleted_at =
      this.utilityService.returnStringDateWithBrazilianTimeZone();
    await this.entityRepository.save(entity);
  }

  public async delete(
    argument: object,
    actionDoneBy?: number,
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

  public async logChange(
    action: string,
    actionDoneBy: number,
    entityId: number,
    oldValue: object,
    newValue: object,
    actionDescription?: string,
  ): Promise<void> {
    const entityAudit = new AuditEntity();
    entityAudit.action = action;
    entityAudit.actionDoneBy = actionDoneBy;
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
