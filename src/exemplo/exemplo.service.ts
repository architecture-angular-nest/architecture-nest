import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { Exemplo } from './entities/exemplo.entity';
import { ExemploAudit } from './entities/exemplo-audit.entity';
import { CrudService } from './../core/architecture/services/crud.service';
@Injectable()
export class ExemploService extends CrudService<Exemplo, ExemploAudit, number> {

  constructor(
    @InjectRepository(Exemplo)
    private readonly exemploRepository: Repository<Exemplo>,
    @InjectRepository(ExemploAudit)
    private readonly exemploAuditRepository: Repository<ExemploAudit>
  ) {
    super(exemploRepository, exemploAuditRepository);
  }
}
