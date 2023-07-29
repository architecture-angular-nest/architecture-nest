import { Entity } from 'typeorm';
import { AuditEntityBase } from './../../core/architecture/entities/audit-entity-base.entity';

@Entity('users_audit')
export class UserAudit extends AuditEntityBase {}
