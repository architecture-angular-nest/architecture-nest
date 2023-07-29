import { Entity } from 'typeorm';
import { UserAudit } from '../user-audit';
import { AuditEntityTypeOrm } from '../../../core/architecture/entities/typeorm/audit-entity.entity';

@Entity('users_audit')
export class UserAuditTypeOrm extends AuditEntityTypeOrm implements UserAudit {}
