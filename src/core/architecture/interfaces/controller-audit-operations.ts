import { Response } from "express"

export interface ControllerAuditOperations<Entity, EntityToAudit, ID> {
    findOneEntityLogsWithPaginator(
        id: ID,
        page: number,
        limit: number,
        res?: Response
    ): Promise<Response<any, Record<string, any>>>;

    findOneEntityLogs(
        id: ID,
        res?: Response
    ): Promise<Response<any, Record<string, any>>>;

    findEntityLogsWithPaginator(
        page: number,
        limit: number,
        res?: Response
    ): Promise<Response<any, Record<string, any>>>;

    findEntityLogs(
        res?: Response
    ): Promise<Response<any, Record<string, any>>>;

    undoLastChange(
        id: ID,
        res?: Response
    ): Promise<Response<any, Record<string, any>>>;
}