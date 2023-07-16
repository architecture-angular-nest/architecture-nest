import { Entity } from 'typeorm';
import { AuditEntity } from 'src/core/architecture/entities/typeorm/audit-entity.entity';

@Entity('exemplos_audit')
export class ExemploAudit extends AuditEntity {}
