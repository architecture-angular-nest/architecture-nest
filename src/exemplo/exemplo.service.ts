import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { Exemplo } from './entities/exemplo.entity';
import { ExemploAudit } from './entities/exemplo-audit.entity';
import { CrudAndAuditOperationsService } from 'src/core/architecture/services/crud-and-audit-operations.service';
@Injectable()
export class ExemploService
  extends CrudAndAuditOperationsService<Exemplo, ExemploAudit, EntityId> {

  constructor(
    @InjectRepository(Exemplo)
    private readonly exemploRepository: Repository<Exemplo>,
    @InjectRepository(ExemploAudit)
    private readonly exemploAuditRepository: Repository<ExemploAudit>
  ) {
    super(exemploRepository, exemploAuditRepository);
  }
}
