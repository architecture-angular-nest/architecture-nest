export interface ServiceGeneralOperations<Entity, EntityToAudit, ID> {
    create(
        createEntityDto: Partial<Entity>,
        actionDoneBy?: ID,
    ): Promise<Entity>;

    findOne(argument?: object): Promise<Entity>;

    update(
        updateEntityDto: Partial<Entity>,
        actionDoneBy?: ID,
        actionDescription?: string,
    ): Promise<Entity>;

    softDelete(
        argument: object,
        actionDoneBy?: ID,
        actionDescription?: string,
    ): Promise<void>;

    delete(
        argument: object,
        actionDoneBy?: ID,
        actionDescription?: string,
    ): Promise<void>;

    restore(
        argument: object,
        actionDoneBy?: ID,
        actionDescription?: string,
    ): Promise<Entity>;

    logChange(
        action: string,
        actionDoneBy: ID,
        entityId: number,
        oldValue: object,
        newValue: object,
        actionDescription?: string,
    ): Promise<void>;

    findAuditEntities(argument: object): Promise<EntityToAudit[]>;
}