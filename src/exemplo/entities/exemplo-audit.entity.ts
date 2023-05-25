import { AuditEntity } from 'src/core/architecture/entities/audit-entity.entity';
import { Entity } from 'typeorm';

@Entity('exemplos_audit')
export class ExemploAudit extends AuditEntity { }
