import { Entity } from 'typeorm';
import { AuditEntity } from '../../../core/architecture/entities/typeorm/audit-entity.entity';
import { ExemploAudit } from '../exemplo-audit';

@Entity('exemplos_audit')
export class ExemploAuditTypeOrm extends AuditEntity implements ExemploAudit {}
