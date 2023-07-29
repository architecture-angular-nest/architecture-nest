import { Repository } from 'typeorm';
import { ExemploTypeOrm } from '../entities/typeorm/exemplo.entity';
import { CreateExemploDto } from './../dto/create-exemplo.dto';
import dataSource from 'src/core/architecture/database/data-source';
import { ExemploAuditTypeOrm } from '../entities/typeorm/exemplo-audit.sentity';
import { EntityId } from '../../core/architecture/types/enity-id.type';
import { TypeOrmWithAuditRepository } from '../../core/architecture/repositories/typeorm/typeorm-with-audit.repository';

export class ExemploRepository extends TypeOrmWithAuditRepository<
  ExemploTypeOrm,
  ExemploAuditTypeOrm,
  EntityId,
  CreateExemploDto
> {
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
}
