import { Repository } from 'typeorm';
import dataSource from 'database/data-source';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserAudit } from '../entities/user-audit.entity';
import { EntityId } from '../../core/architecture/types/enity-id.type';
import { TypeOrmWithAuditRepository } from '../../core/architecture/repositories/typeorm/typeorm-with-audit.repository';
class UserRepositoryWithAudit extends TypeOrmWithAuditRepository<
  User,
  UserAudit,
  EntityId,
  CreateUserDto
> {
  public static instance: UserRepositoryWithAudit | null = null;

  private constructor(
    protected readonly entityRepository: Repository<User>,
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

  public findByEmail(email: string): Promise<User> {
    return this.findOne({
      where: { email: email.toLowerCase() },
    });
  }
  public findOneWithEspacificFildsByEmail(
    fields: object,
    email: string,
  ): Promise<User> {
    return this.findOne({
      select: {
        ...fields,
      },
      where: { email: email.toLowerCase() },
    });
  }
}

export const getRepository = async () => {
  const dS = await dataSource;
  if (!UserRepositoryWithAudit.instance) {
    const entityRepository: Repository<User> = dS.getRepository(User);
    const auditRepository: Repository<UserAudit> = dS.getRepository(UserAudit);

    return UserRepositoryWithAudit.createInstance(
      entityRepository,
      auditRepository,
    );
  }

  return UserRepositoryWithAudit.instance;
};
