import { Entity } from 'typeorm';
import { AuditEntity } from './../../core/architecture/entities/audit-entity.entity';

@Entity('users_audit')
export class UserAudit extends AuditEntity {}
