import { Repository } from 'typeorm';
import { Exemplo } from '../entities/typeorm/exemplo.schema';
import { CreateExemploDto } from './../dto/create-exemplo.dto';
import dataSource from 'src/core/architecture/database/data-source';
import { ExemploAudit } from '../entities/typeorm/exemplo-audit.schema';
import { EntityId } from '../../core/architecture/types/enity-id.type';
import { TypeOrmWithAuditRepository } from '../../core/architecture/repositories/typeorm/typeorm-with-audit.repository';

class ExemploRepository extends TypeOrmWithAuditRepository<
  Exemplo,
  ExemploAudit,
  EntityId,
  CreateExemploDto
> {
  public static instance: ExemploRepository | null = null;

  private constructor(
    protected readonly entityRepository: Repository<Exemplo>,
    protected readonly auditRepository: Repository<ExemploAudit>,
  ) {
    super(entityRepository, auditRepository);
  }

  public static createInstance(
    entityRepository: Repository<Exemplo>,
    auditRepository: Repository<ExemploAudit>,
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

export const getRepository = async () => {
  const dS = await dataSource;
  if (!ExemploRepository.instance) {
    const entityRepository: Repository<Exemplo> = dS.getRepository(Exemplo);
    const auditRepository: Repository<ExemploAudit> =
      dS.getRepository(ExemploAudit);

    return ExemploRepository.createInstance(entityRepository, auditRepository);
  }

  return ExemploRepository.instance;
};
