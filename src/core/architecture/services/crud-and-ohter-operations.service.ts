import { HttpStatus, HttpException } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";

import { FindOptionsSelect, FindOptionsSelectByString, FindOptionsWhere, Repository } from "typeorm";
import { AuditEntity } from "../entities/audit-entity.entity";
import { GeneralEntity } from "../entities/general-entity.entity";
import { PaginatedList } from "../interfaces/paginated-list";
import { ActionAuditEnum } from "../enums/action-audit.enum";
import { CrudService } from './crud.service';
import { ServiceOtherOperations } from '../interfaces/service-other-operations';

export abstract class CrudAndOtherOperationsService<
    Entity extends GeneralEntity,
    EntityToAudit extends AuditEntity,
    ID>
    extends CrudService<Entity, EntityToAudit, ID>
    implements ServiceOtherOperations<Entity, EntityToAudit, ID>{

    constructor(
        @InjectRepository(GeneralEntity)
        protected entityRepository: Repository<Entity>,
        @InjectRepository(AuditEntity)
        protected auditRepository: Repository<EntityToAudit>,
    ) {
        super(entityRepository, auditRepository);
    }

    public async findOneEntityLogsWithPaginator(
        entityId: ID,
        page: number,
        limit: number
    ): Promise<PaginatedList<EntityToAudit>> {
        const [data, total] = await this.auditRepository.findAndCount({
            select: {
                id: true,
                action: true,
                actionDescription: true,
                actionDoneBy: true,
                entityId: true,
                timestamp: true,
            } as FindOptionsSelect<EntityToAudit> | FindOptionsSelectByString<EntityToAudit>,
            take: limit,
            skip: (page - 1) * limit,
            where: { entityId: entityId } as FindOptionsWhere<EntityToAudit> | FindOptionsWhere<EntityToAudit>[]
        });

        return { data, total };
    }

    public async findOneEntityLogs(
        entityId: ID,
    ): Promise<EntityToAudit[]> {
        return this.auditRepository.find({
            select: {
                id: true,
                action: true,
                actionDescription: true,
                actionDoneBy: true,
                entityId: true,
                timestamp: true,
            } as FindOptionsSelect<EntityToAudit> | FindOptionsSelectByString<EntityToAudit>,
            where: { entityId: entityId } as FindOptionsWhere<EntityToAudit> | FindOptionsWhere<EntityToAudit>[]
        });
    }

    public async findEntityLogsWithPaginator(
        page: number,
        limit: number
    ): Promise<PaginatedList<EntityToAudit>> {
        const [data, total] = await this.auditRepository.findAndCount({
            select: {
                id: true,
                action: true,
                actionDescription: true,
                actionDoneBy: true,
                entityId: true,
                timestamp: true,
            } as FindOptionsSelect<EntityToAudit> | FindOptionsSelectByString<EntityToAudit>,
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
            } as FindOptionsSelect<EntityToAudit> | FindOptionsSelectByString<EntityToAudit>,
        });
    }

    public async undoLastChange(
        entityId: ID,
        actionDoneBy?: ID,
    ): Promise<void | Entity> {
        const lastChange: EntityToAudit[] = await this.findAuditEntities({
            order: {
                timestamp: 'DESC',
            },
            where: {
                entityId: entityId,
            },
            take: 5,
        });

        const entityThatWasDeleted: boolean = lastChange[0].action ===
            ActionAuditEnum.DELETE;

        if (entityThatWasDeleted) throw new HttpException(
            `Entidade deletada difinivamente, não há recuperação.`,
            HttpStatus.NOT_FOUND
        );


        const entityThatWasSoftDeleted: boolean = lastChange[0].action ===
            ActionAuditEnum.SOFTDELETE;

        if (entityThatWasSoftDeleted) return this.restoreEntity(
            {
                where: {
                    id: lastChange[0].oldValue['id']
                }
            },
            actionDoneBy
        );

        return this.update(
            { ...lastChange[0].oldValue },
            actionDoneBy,
            'last change undone'
        );
    }

    private async restoreEntity(
        argument: object,
        actionDoneBy?: ID,
    ) {
        return this.restore(argument, actionDoneBy, 'Restore Entity');
    }
}