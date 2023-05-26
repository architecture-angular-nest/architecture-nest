
import {
    Get,
    Param,
    Post,
    Query,
    Res
} from '@nestjs/common';

import { AuditEntity } from "../entities/audit-entity.entity";
import { GeneralEntity } from "../entities/general-entity.entity";
import { Response } from 'express';
import { CrudCrontoler } from './crud.controler';
import { ControllerAuditOperations } from '../interfaces/controller-audit-operations';
import { CrudAndOtherOperationsService } from '../services/crud-and-ohter-operations.service';

export abstract class CrudAndAuditOperationsCrontoler<
    Entity extends GeneralEntity,
    EntityToAudit extends AuditEntity,
    ID>
    extends CrudCrontoler<Entity, EntityToAudit, ID>
    implements ControllerAuditOperations<Entity, EntityToAudit, ID>{

    constructor(
        protected readonly service: CrudAndOtherOperationsService<Entity, EntityToAudit, ID>
    ) {
        super(service)
    }

    @Get('paged-logs-of-one-entity/:id')
    public async findOneEntityLogsWithPaginator(
        @Param('id') id: ID,
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Res() res?: Response
    ): Promise<Response<any, Record<string, any>>> {
        try {
            const anEntityLogs = await this.service
                .findOneEntityLogsWithPaginator(
                    id,
                    Number(page),
                    Number(limit)
                );

            return res.status(200).send(anEntityLogs);
        } catch (error) {
            return res.status(error.status || 500).send(
                error.status == 500 || !error.status ?
                    { message: 'Internal Server Error' } :
                    error
            );
        }
    }

    @Get('logs-of-one-entity/:id')
    public async findOneEntityLogs(
        @Param('id') id: ID,
        @Res() res?: Response
    ): Promise<Response<any, Record<string, any>>> {
        try {
            const anEntityLogs = await this.service
                .findOneEntityLogs(id);

            return res.status(200).send(anEntityLogs);
        } catch (error) {
            return res.status(error.status || 500).send(
                error.status == 500 || !error.status ?
                    { message: 'Internal Server Error' } :
                    error
            );
        }
    }

    @Get('paged-logs-of-entity')
    public async findEntityLogsWithPaginator(
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Res() res?: Response
    ): Promise<Response<any, Record<string, any>>> {
        try {
            const entityLogs = await this.service
                .findEntityLogsWithPaginator(
                    Number(page),
                    Number(limit)
                );

            return res.status(200).send(entityLogs);
        } catch (error) {
            return res.status(error.status || 500).send(
                error.status == 500 || !error.status ?
                    { message: 'Internal Server Error' } :
                    error
            );
        }
    }

    @Get('logs-of-entity')
    public async findEntityLogs(
        @Res() res?: Response
    ): Promise<Response<any, Record<string, any>>> {
        try {
            const entityLogs = await this.service
                .findEntityLogs();

            return res.status(200).send(entityLogs);
        } catch (error) {
            return res.status(error.status || 500).send(
                error.status == 500 || !error.status ?
                    { message: 'Internal Server Error' } :
                    error
            );
        }
    }

    @Post('undo-last-change/:id')
    public async undoLastChange(
        @Param('id') id: ID,
        @Res() res?: Response
    ) {
        try {
            const undoChangeResult = await this.service
                .undoLastChange(id);

            return res.status(200).send(undoChangeResult);
        } catch (error) {
            return res.status(error.status || 500).send(
                error.status == 500 || !error.status ?
                    { message: 'Internal Server Error' } :
                    error
            );
        }
    }
}