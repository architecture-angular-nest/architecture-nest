import dataSource from 'database/data-source';
import { Exemplo } from './../entities/exemplo.entity';
import { CreateExemploDto } from './../dto/create-exemplo.dto';
import { ExemploAudit } from './../entities/exemplo-audit.entity';
import { EntityId } from './../../core/architecture/types/enity-id';
import { TypeOrmWithAuditRepository } from '../../core/architecture/repositories/typeorm/typeorm-with-audit.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
export class ExemploRepositoryWithAudit extends TypeOrmWithAuditRepository<
  Exemplo,
  ExemploAudit,
  EntityId,
  CreateExemploDto
> {
  private static instance: ExemploRepositoryWithAudit | null = null;

  private constructor(
    @InjectRepository(Exemplo)
    protected readonly entityRepository: Repository<Exemplo>,
    @InjectRepository(ExemploAudit)
    protected readonly auditRepository: Repository<ExemploAudit>,
  ) {
    super(entityRepository, auditRepository);
  }

  static createInstance(
    entityRepository: Repository<Exemplo>,
    auditRepository: Repository<ExemploAudit>,
  ): ExemploRepositoryWithAudit {
    if (!ExemploRepositoryWithAudit.instance) {
      ExemploRepositoryWithAudit.instance = new ExemploRepositoryWithAudit(
        entityRepository,
        auditRepository,
      );
    }

    return this.instance;
  }
}
