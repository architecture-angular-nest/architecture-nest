import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserTypeOrm } from '../entities/typeorm/user.entity';
import { EntityId } from '../../core/architecture/types/enity-id.type';
import { UserAuditTypeOrm } from '../entities/typeorm/user-audit.entity';
import { IUserRepository } from '../interfaces/user-repository.interface';
import { TypeOrmWithAuditRepository } from '../../core/architecture/repositories/typeorm/typeorm-with-audit.repository';

export class UserRepository
  extends TypeOrmWithAuditRepository<
    UserTypeOrm,
    UserAuditTypeOrm,
    EntityId,
    CreateUserDto
  >
  implements IUserRepository
{
  public static instance: UserRepository | null = null;

  private constructor(
    protected readonly entityRepository: Repository<UserTypeOrm>,
    protected readonly auditRepository: Repository<UserAuditTypeOrm>,
  ) {
    super(entityRepository, auditRepository);
  }

  public static createInstance(
    entityRepository: Repository<UserTypeOrm>,
    auditRepository: Repository<UserAuditTypeOrm>,
  ): UserRepository {
    if (!UserRepository.instance) {
      UserRepository.instance = new UserRepository(
        entityRepository,
        auditRepository,
      );
    }

    return this.instance;
  }

  public findByEmail(email: string): Promise<UserTypeOrm> {
    return this.findOne({
      where: { email: email.toLowerCase() },
    });
  }
  public findOneWithEspacificFildsByEmail(
    fields: object,
    email: string,
  ): Promise<UserTypeOrm> {
    return this.findOne({
      select: {
        ...fields,
      },
      where: { email: email.toLowerCase() },
    });
  }
}
