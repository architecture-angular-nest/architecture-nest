import { InjectRepository } from '@nestjs/typeorm';

import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { AuditEntity } from '../entities/audit-entity.entity';
import { GeneralEntity } from '../entities/general-entity.entity';
import { GeneralService } from './general.service';
import { ServiceCrudOperations } from '../interfaces/service-crud-operations';
import { PaginatedList } from '../interfaces/paginated-list';

export abstract class CrudService<
    Entity extends GeneralEntity,
    EntityToAudit extends AuditEntity,
    ID,
  >
  extends GeneralService<Entity, EntityToAudit, ID>
  implements ServiceCrudOperations<Entity, ID>
{
  constructor(
    @InjectRepository(GeneralEntity)
    protected entityRepository: Repository<Entity>,
    @InjectRepository(AuditEntity)
    protected auditRepository: Repository<EntityToAudit>,
  ) {
    super(entityRepository, auditRepository);
  }

  public createEntity(
    createEntityDto: Partial<Entity>,
    actionDoneBy?: ID,
  ): Promise<Entity> {
    return this.create(createEntityDto, actionDoneBy);
  }

  public findAllEntity(options?: FindManyOptions<Entity>): Promise<Entity[]> {
    return this.find(options);
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

  public findOneEntity(
    id?: ID,
    options?: FindOneOptions<Entity>,
  ): Promise<Entity> {
    const optionsQuery = (
      !!id
        ? {
            where: { id },
          }
        : options
    ) as FindOneOptions<Entity>;

    return this.findOne(optionsQuery);
  }

  public updateEntity(
    id: ID,
    updateEntityDto: Partial<Entity>,
    actionDoneBy?: ID,
    actionDescription?: string,
  ): Promise<Entity> {
    return this.update(
      { id: +id, ...updateEntityDto },
      actionDoneBy,
      actionDescription,
    );
  }

  public removeEntity(id: ID): Promise<void> {
    return this.softDelete({
      where: { id },
    });
  }
}
