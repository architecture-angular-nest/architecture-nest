import { Entity } from 'typeorm';
import { ExemploAudit } from '../exemplo-audit';
import { AuditEntityTypeOrm } from '../../../core/architecture/entities/typeorm/audit-entity.entity';

@Entity('exemplos_audit')
export class ExemploAuditTypeOrm
  extends AuditEntityTypeOrm
  implements ExemploAudit {}
