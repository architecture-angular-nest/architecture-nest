import { Repository } from 'typeorm';
import { CreateExemploDto } from './../dto/create-exemplo.dto';
import { ExemploTypeOrm } from '../entities/typeorm/exemplo.entity';
import { EntityId } from '../../core/architecture/types/enity-id.type';
import { ExemploAuditTypeOrm } from '../entities/typeorm/exemplo-audit.sentity';
import { IExemploRepository } from '../interfaces/exemplo-repository.interface';
import { TypeOrmWithAuditRepository } from '../../core/architecture/repositories/typeorm/typeorm-with-audit.repository';

export class ExemploRepository
  extends TypeOrmWithAuditRepository<
    ExemploTypeOrm,
    ExemploAuditTypeOrm,
    EntityId,
    CreateExemploDto
  >
  implements IExemploRepository
{
  public static instance: ExemploRepository | null = null;

  private constructor(
    protected readonly entityRepository: Repository<ExemploTypeOrm>,
    protected readonly auditRepository: Repository<ExemploAuditTypeOrm>,
  ) {
    super(entityRepository, auditRepository);
  }

  public static createInstance(
    entityRepository: Repository<ExemploTypeOrm>,
    auditRepository: Repository<ExemploAuditTypeOrm>,
  ): ExemploRepository {
    if (!ExemploRepository.instance) {
      ExemploRepository.instance = new ExemploRepository(
        entityRepository,
        auditRepository,
      );
    }

    return this.instance;
  }

  public findOneEntityById(id: number): Promise<ExemploTypeOrm> {
    return this.findOne({
      where: { id },
    });
  }
}
