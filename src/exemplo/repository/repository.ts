import { Exemplo } from './../entities/exemplo.entity';
import { CreateExemploDto } from './../dto/create-exemplo.dto';
import { ExemploAudit } from './../entities/exemplo-audit.entity';
import { EntityId } from './../../core/architecture/types/enity-id';
import { TypeOrmWithAuditRepository } from '../../core/architecture/repositories/typeorm/typeorm-with-audit.repository';
import dataSource from 'database/data-source';
export abstract class RepositoryWithAudit extends TypeOrmWithAuditRepository<
  Exemplo,
  ExemploAudit,
  EntityId,
  CreateExemploDto
> {
  public readonly entityRepository = dataSource.getRepository(Exemplo);
  public readonly auditRepository = dataSource.getRepository(ExemploAudit);

  constructor() {
    super(
      dataSource.getRepository(Exemplo),
      dataSource.getRepository(ExemploAudit),
    );
  }
}
