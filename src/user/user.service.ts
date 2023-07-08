import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserAudit } from './entities/user-audit.entity';
import { GeneralService } from '../core/architecture/services/general.service';

@Injectable()
export class UserService extends GeneralService<
  User,
  UserAudit,
  EntityId,
  CreateUserDto
> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserAudit)
    private readonly userAuditRepository: Repository<UserAudit>,
  ) {
    super(userRepository, userAuditRepository);
  }

  public async createEntity(
    createEntityDto: CreateUserDto,
    actionDoneBy?: Express.User,
  ): Promise<User> {
    const emailUserAlreadyExists = await this.findOne({
      where: { email: createEntityDto.email.toLowerCase() },
    });

    if (emailUserAlreadyExists) {
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
