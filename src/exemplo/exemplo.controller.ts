import {
  Controller,
} from '@nestjs/common';

import { ExemploService } from './exemplo.service';
import { Exemplo } from './entities/exemplo.entity';
import { ExemploAudit } from './entities/exemplo-audit.entity';
import { CrudAndAuditOperationsCrontoler } from '../core/architecture/controllers/crud-and-audit-operations.controller';

@Controller('exemplo')
export class ExemploController
  extends CrudAndAuditOperationsCrontoler<Exemplo, ExemploAudit, EntityId> {

  constructor(
    private readonly exemploService: ExemploService
  ) {
    super(exemploService)
  }
}
