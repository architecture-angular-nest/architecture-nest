import { CreateExemploDto } from '../dto/create-exemplo.dto';
import { UpdateExemploDto } from '../dto/update-exemplo.dto';
import { ExemploTypeOrm } from '../entities/typeorm/exemplo.entity';
import { EntityId } from 'src/core/architecture/types/enity-id';
import { ExemploAuditTypeOrm } from '../entities/typeorm/exemplo-audit.sentity';
import { CrudWithAuditOperations } from 'src/core/architecture/interfaces/crud-with-audit-operations';

export interface IExemploRepository
  extends CrudWithAuditOperations<
    ExemploTypeOrm,
    ExemploAuditTypeOrm,
    EntityId,
    CreateExemploDto
  > {
  createEntity<T>(
    createEntityDto: CreateExemploDto,
    actionDoneBy?: T,
  ): Promise<ExemploTypeOrm>;

  findAllEntity(): Promise<ExemploTypeOrm[]>;

  findOneEntity(id?: number, options?: object): Promise<ExemploTypeOrm>;

  updateEntity<T>(
    id: number,
    updateEntityDto: UpdateExemploDto,
    actionDoneBy?: T,
  ): Promise<ExemploTypeOrm>;

  removeEntity<T>(id: number, actionDoneBy?: T): Promise<void>;
}
