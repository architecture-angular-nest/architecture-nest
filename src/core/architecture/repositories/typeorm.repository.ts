import { InjectRepository } from "@nestjs/typeorm";
import { HttpException, HttpStatus, Inject } from "@nestjs/common";

import {
    DeepPartial,
    EntityManager,
    FindManyOptions,
    FindOneOptions,
    Repository
} from "typeorm";
import { GeneralEntity } from "../entities/general-entity.entity";
import { UtilityService } from '../../../shared/services/utility.service';
import { RepositoryOperations } from "../interfaces/reapository-operations";
import { PaginatedList } from "../interfaces/paginated-list";

export abstract class TypeOrmRepository<
    Entity extends GeneralEntity,
    ID,
    CreateEntityDto,
> implements RepositoryOperations<
    Entity,
    ID,
    CreateEntityDto
>
{
    @Inject(UtilityService)
    protected readonly utilityService: UtilityService;

    constructor(
        @InjectRepository(GeneralEntity)
        protected entityRepository: Repository<Entity>,
    ) { }

    public async create(
        createEntityDto: CreateEntityDto,
        actionDoneBy?: ID,
    ): Promise<Entity> {
        return await this.entityRepository.manager.transaction(
            async (entityManager: EntityManager): Promise<Entity> => {
                const entity = this.entityRepository.create({
                    created_by: actionDoneBy,
                    ...createEntityDto
                } as DeepPartial<Entity>);
                const savedEntity = await entityManager.save(entity);

                return savedEntity;
            },
        );
    }

    public async findOne(options?: FindOneOptions<Entity>): Promise<Entity> {
        const entity = await this.entityRepository.findOne(options);

        return entity;
    }

    public async find(options?: FindManyOptions<Entity>): Promise<Entity[]> {
        const entity = await this.entityRepository.find(options);

        return entity;
    }

    public async findWithPaginator(
        page: number,
        limit: number,
    ): Promise<PaginatedList<Entity>> {
        const [data, total] = await this.entityRepository.findAndCount({
            take: limit,
            skip: (page - 1) * limit,
        });

        return { data, total };
    }

    public async update(
        updateEntityDto: Partial<CreateEntityDto>,
        actionDoneBy?: ID,
    ): Promise<Entity> {
        return await this.entityRepository.manager.transaction(
            async (entityManager: EntityManager): Promise<Entity> => {
                const entity = await this.entityRepository.preload({
                    updated_by: actionDoneBy,
                    ...updateEntityDto
                } as unknown as DeepPartial<Entity>);

                if (!entity)
                    throw new HttpException(
                        `Registro não encontrado`,
                        HttpStatus.NOT_FOUND,
                    );

                const updatedEntity = entityManager.save(entity);

                return updatedEntity;
            },
        );
    }

    public async softDelete(
        options: FindOneOptions<Entity>,
        actionDoneBy?: ID,
    ): Promise<void> {
        return await this.entityRepository.manager.transaction(
            async (entityManager: EntityManager): Promise<void> => {
                const entity: Entity = await this.entityRepository.findOne(options);

                if (!entity)
                    throw new HttpException(
                        `Registro não encontrado`,
                        HttpStatus.NOT_FOUND,
                    );

                entity.status = 'DELETED';
                entity.deleted_by = actionDoneBy as EntityId;
                entity.deleted_at = this.utilityService
                    .returnStringDateWithBrazilianTimeZone();
                await entityManager.save(entity);
            },
        );
    }

    public async delete(
        options: FindOneOptions<Entity>,
    ): Promise<void> {
        return await this.entityRepository.manager.transaction(
            async (entityManager: EntityManager): Promise<void> => {
                const entity: Entity = await this.entityRepository.findOne(options);

                if (!entity)
                    throw new HttpException(
                        `Registro não encontrado`,
                        HttpStatus.NOT_FOUND,
                    );

                await entityManager.remove(entity);
            },
        );
    }

}
