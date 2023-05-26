
import {
    Get,
    Post,
    Body,
    Patch,
    Param,
    Query,
    Delete,
    Res
} from '@nestjs/common';

import { AuditEntity } from "../entities/audit-entity.entity";
import { GeneralEntity } from "../entities/general-entity.entity";
import { CrudControllerOperations } from "../interfaces/crud-controller-operations";
import { CrudService } from "../services/crud.service";
import { Response } from 'express';

export abstract class CrudCrontoler<
    Entity extends GeneralEntity,
    EntityToAudit extends AuditEntity,
    ID>
    implements CrudControllerOperations<Entity, ID> {

    constructor(
        protected readonly service: CrudService<Entity, EntityToAudit, ID>
    ) { }

    @Post()
    public async create(
        @Body() createDto: Partial<Entity>,
        @Res() res?: Response
    ): Promise<Response<any, Record<string, any>>> {

        try {
            const savedEntity = await this.service
                .createEntity(createDto);

            return res.status(201).send(savedEntity);
        } catch (error) {
            return res.status(error.status || 500).send(
                error.status == 500 || !error.status ?
                    { message: 'Internal Server Error' } :
                    error
            );
        }
    }

    @Get()
    public async findAll(
        @Res() res?: Response
    ): Promise<Response<any, Record<string, any>>> {
        try {
            const allEntity = await this.service
                .findAllEntity();

            return res.status(200).send(allEntity);
        } catch (error) {
            return res.status(error.status || 500).send(
                error.status == 500 || !error.status ?
                    { message: 'Internal Server Error' } :
                    error
            );
        }
    }

    @Get('findAll')
    public async findWithPaginator(
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Res() res?: Response
    ): Promise<Response<any, Record<string, any>>> {
        try {
            const allEntity = await this.service
                .findWithPaginator(
                    Number(page),
                    Number(limit)
                );

            return res.status(200).send(allEntity);
        } catch (error) {
            return res.status(error.status || 500).send(
                error.status == 500 || !error.status ?
                    { message: 'Internal Server Error' } :
                    error
            );
        }
    }

    @Get(':id')
    public async findOne(
        @Param('id') id: ID,
        @Res() res?: Response
    ): Promise<Response<any, Record<string, any>>> {
        try {
            const entity = await this.service
                .findOneEntity(id);

            return res.status(200).send(entity);
        } catch (error) {
            return res.status(error.status || 500).send(
                error.status == 500 || !error.status ?
                    { message: 'Internal Server Error' } :
                    error
            );
        }
    }

    @Patch(':id')
    public async update(
        @Param('id') id: ID,
        @Body() updateDto: Partial<Entity>,
        @Res() res?: Response
    ): Promise<Response<any, Record<string, any>>> {
        try {
            const updatedEntity = await this.service
                .updateEntity(id, updateDto);

            return res.status(200).send(updatedEntity);
        } catch (error) {
            return res.status(error.status || 500).send(
                error.status == 500 || !error.status ?
                    { message: 'Internal Server Error' } :
                    error
            );
        }
    }

    @Delete(':id')
    public async remove(
        @Param('id') id: ID,
        @Res() res?: Response
    ): Promise<Response<any, Record<string, any>>> {
        try {
            await this.service.removeEntity(id);

            return res.status(204).send();
        } catch (error) {
            return res.status(error.status || 500).send(
                error.status == 500 || !error.status ?
                    { message: 'Internal Server Error' } :
                    error
            );
        }
    }
}