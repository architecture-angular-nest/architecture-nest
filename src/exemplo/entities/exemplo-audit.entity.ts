import { Entity } from 'typeorm';
import { AuditEntityBase } from './../../core/architecture/entities/audit-entity-base.entity';

@Entity('exemplos_audit')
export class ExemploAudit extends AuditEntityBase {}
