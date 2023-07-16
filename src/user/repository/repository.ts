import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserAudit } from '../entities/user-audit.entity';
import { EntityId } from './../../core/architecture/types/enity-id';
import { TypeOrmWithAuditRepository } from '../../core/architecture/repositories/typeorm/typeorm-with-audit.repository';
export class UserRepositoryWithAudit extends TypeOrmWithAuditRepository<
  User,
  UserAudit,
  EntityId,
  CreateUserDto
> {
  private static instance: UserRepositoryWithAudit | null = null;

  private constructor(
    @InjectRepository(User)
    protected readonly entityRepository: Repository<User>,
    @InjectRepository(UserAudit)
    protected readonly auditRepository: Repository<UserAudit>,
  ) {
    super(entityRepository, auditRepository);
  }

  static createInstance(
    entityRepository: Repository<User>,
    auditRepository: Repository<UserAudit>,
  ): UserRepositoryWithAudit {
    if (!UserRepositoryWithAudit.instance) {
      UserRepositoryWithAudit.instance = new UserRepositoryWithAudit(
        entityRepository,
        auditRepository,
      );
    }

    return this.instance;
  }
}
