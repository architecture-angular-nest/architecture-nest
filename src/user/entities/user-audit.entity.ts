import { Entity } from 'typeorm';
import { AuditEntityTypeOrm } from '../../core/architecture/entities/typeorm/audit-entity.entity';

@Entity('users_audit')
export class UserAudit extends AuditEntityTypeOrm {}
