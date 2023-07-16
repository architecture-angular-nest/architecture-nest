import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserAudit } from './entities/user-audit.entity';
import { EntityId } from './../core/architecture/types/enity-id';
import { UserRepositoryWithAudit } from './repository/repository';
import { UtilityService } from './../shared/services/utility.service';
import { CrudWithAuditService } from 'src/core/architecture/services/crud-with-audit.service';

@Injectable()
export class UserService extends CrudWithAuditService<
  User,
  UserAudit,
  EntityId,
  CreateUserDto
> {
  private repositoryWithAudit: UserRepositoryWithAudit;

  constructor(
    private readonly utilityService: UtilityService,
    @InjectRepository(User)
    entityRepository: Repository<User>,
    @InjectRepository(UserAudit)
    auditRepository: Repository<UserAudit>,
  ) {
    const repositoryWithAudit = UserRepositoryWithAudit.createInstance(
      entityRepository,
      auditRepository,
    );
    super(repositoryWithAudit);

    this.repositoryWithAudit = repositoryWithAudit;
  }

  public async createEntity(
    createEntityDto: CreateUserDto,
    actionDoneBy?: Express.User,
  ): Promise<User> {
    const emailUserAlreadyExists = await this.repositoryWithAudit.findByEmail(
      createEntityDto.email.toLowerCase(),
    );
    if (emailUserAlreadyExists) {
      throw new HttpException(
        'E-mail already registered',
        HttpStatus.BAD_REQUEST,
      );
    }

    const createdUser: User = await this.createEntity(
      {
        ...createEntityDto,
        email: createEntityDto.email.toLowerCase(),
        password: await bcrypt.hash(createEntityDto.password, 10),
      },
      actionDoneBy['id'],
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
