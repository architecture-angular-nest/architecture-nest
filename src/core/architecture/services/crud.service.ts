import { PaginatedList } from '../interfaces/paginated-list';
import { CrudOperations } from '../interfaces/crud-operations';

export abstract class CrudService<Entity, ID, CreateEntityDto>
  implements CrudOperations<Entity, ID, CreateEntityDto>
{
  constructor(
    protected entityRepository:
      | CrudOperations<Entity, ID, CreateEntityDto>
      | Promise<CrudOperations<Entity, ID, CreateEntityDto>>,
  ) {}

  public async create(
    createEntityDto: CreateEntityDto,
    actionDoneBy: ID,
  ): Promise<Entity> {
    const repository = await this.entityRepository;
    return repository.create(createEntityDto, actionDoneBy);
  }

  public async findOne(options?: unknown): Promise<Entity> {
    const repository = await this.entityRepository;
    return repository.findOne(options);
  }

  public async find(options?: unknown): Promise<Entity[]> {
    const repository = await this.entityRepository;
    return repository.find(options);
  }

  public async findWithPaginator(
    page: number,
    limit: number,
  ): Promise<PaginatedList<Entity>> {
    const repository = await this.entityRepository;
    return repository.findWithPaginator(limit, page);
  }

  public async update(
    updateEntityDto: Partial<CreateEntityDto>,
    actionDoneBy: ID,
    actionDescription?: string,
  ): Promise<Entity> {
    const repository = await this.entityRepository;
    return repository.update(updateEntityDto, actionDoneBy, actionDescription);
  }

  public async softDelete(
    options: Partial<CreateEntityDto>,
    actionDoneBy?: ID,
    actionDescription?: string,
  ): Promise<void> {
    const repository = await this.entityRepository;
    return repository.softDelete(options, actionDoneBy, actionDescription);
  }

  public async delete(
    options: Partial<CreateEntityDto>,
    actionDoneBy?: ID,
    actionDescription?: string,
  ): Promise<void> {
    const repository = await this.entityRepository;
    return repository.delete(options, actionDoneBy, actionDescription);
  }
}
