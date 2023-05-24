import { AuditEntity } from 'src/shared/entities/audit-entity.entity';
import { Entity } from 'typeorm';

@Entity('exemplos_audit')
export class ExemploAudit extends AuditEntity {}
