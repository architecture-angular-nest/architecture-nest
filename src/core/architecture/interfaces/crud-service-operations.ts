export interface CrudServiceOperations<Entity, EntityToAudit, ID> {
    createEntity(
        createEntityDto: Partial<Entity>,
        actionDoneBy?: number,
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
        actionDoneBy?: number,
        actionDescription?: string
    ): Promise<Entity>;

    removeEntity(id: ID): Promise<void>;
}