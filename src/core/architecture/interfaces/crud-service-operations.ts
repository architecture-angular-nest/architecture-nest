import { PaginatedList } from "./paginated-list";

export interface CrudServiceOperations<Entity, ID> {
    createEntity(
        createEntityDto: Partial<Entity>,
        actionDoneBy?: ID,
    ): Promise<Entity>;

    findAllEntity(argument?: object): Promise<Entity[]>;

    findWithPaginator(
        page: number,
        limit: number
    ): Promise<{ data: Entity[]; total: number }>;

    findOneEntity(id?: ID, argument?: object): Promise<Entity>;

    updateEntity(
        id: ID,
        updateEntityDto: Partial<Entity>,
        actionDoneBy?: ID,
        actionDescription?: string
    ): Promise<Entity>;

    removeEntity(id: ID): Promise<void>;
}