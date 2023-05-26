import { PaginatedList } from "./paginated-list";

export interface ServiceOtherOperations<Entity, EntityToAudit, ID> {
    findOneEntityLogsWithPaginator(
        entityId: ID,
        page: number,
        limit: number
    ): Promise<PaginatedList<EntityToAudit>>;

    findOneEntityLogs(
        entityId: ID,
    ): Promise<EntityToAudit[]>;

    findEntityLogsWithPaginator(
        page: number,
        limit: number
    ): Promise<PaginatedList<EntityToAudit>>;

    findEntityLogs(argument?: object): Promise<EntityToAudit[]>;

    undoLastChange(
        entityId: ID,
        actionDoneBy?: ID,
    ): Promise<void | Entity>;
}