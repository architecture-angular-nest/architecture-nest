import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserAudit } from './entities/user-audit.entity';
import { CrudAndAuditOperationsService } from '../core/architecture/services/crud-and-audit-operations.service';

@Injectable()
export class UserService extends CrudAndAuditOperationsService<
  User,
  UserAudit,
  EntityId
> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserAudit)
    private readonly userAuditRepository: Repository<UserAudit>,
  ) {
    super(userRepository, userAuditRepository);
  }

  override async createEntity(
    createEntityDto: Partial<User>,
    actionDoneBy?: EntityId,
  ): Promise<User> {
    const emailCompanyAlreadyExists = await this.findOne({
      where: { email: createEntityDto.email.toLowerCase() },
    });

    if (emailCompanyAlreadyExists) {
      throw new HttpException(
        'E-mail already registered',
        HttpStatus.BAD_REQUEST,
      );
    }

    const createdUser: User = await this.create(
      {
        ...createEntityDto,
        email: createEntityDto.email.toLowerCase(),
        password: await bcrypt.hash(createEntityDto.password, 10),
      },
      actionDoneBy,
    );
    const resturnedUser: User =
      this.utilityService.changeObjectNullValuesToUndefined(
        createdUser,
      ) as User;

    return {
      ...resturnedUser,
      password: undefined,
    };
  }
}
