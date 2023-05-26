import { Response } from "express"

export interface CrudControllerOperations<Entity, ID> {
    create(
        createDto: Partial<Entity>,
        res?: Response
    ): Promise<Response<any, Record<string, any>>>;

    findAll(
        res?: Response
    ): Promise<Response<any, Record<string, any>>>;

    findWithPaginator(
        page: number,
        limit: number,
        res?: Response
    ): Promise<Response<any, Record<string, any>>>;

    findOne(
        id: ID,
        res?: Response
    ): Promise<Response<any, Record<string, any>>>;

    update(
        id: ID,
        updateDto: Partial<Entity>,
        res?: Response
    ): Promise<Response<any, Record<string, any>>>;

    remove(
        id: ID,
        res?: Response
    ): Promise<Response<any, Record<string, any>>>;

}