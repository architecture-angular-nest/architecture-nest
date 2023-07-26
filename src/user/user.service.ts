import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserAudit } from './entities/user-audit.entity';
import { EntityId } from '../core/architecture/types/enity-id.type';
import { getRepository } from './repository/repository';
import { UtilityService } from './../shared/services/utility.service';
import { CrudWithAuditService } from 'src/core/architecture/services/crud-with-audit.service';

@Injectable()
export class UserService extends CrudWithAuditService<
  User,
  UserAudit,
  EntityId,
  CreateUserDto
> {
  constructor(private readonly utilityService: UtilityService) {
    super(getRepository());
  }

  public async createEntity(
    createEntityDto: CreateUserDto,
    actionDoneBy?: Express.User,
  ): Promise<User> {
    const repository = await getRepository();
    const emailUserAlreadyExists = await repository.findByEmail(
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

  public async findOneWithEspacificFildsByEmail(
    fields: string[],
    email: string,
  ) {
    const formatedFilds: object = {};
    Object.keys(fields).forEach((field: string, i: number) => {
      formatedFilds[`${fields[i]}`] = true;
    });
    const repository = await getRepository();

    return repository.findOneWithEspacificFildsByEmail(
      formatedFilds,
      email.toLowerCase(),
    );
  }
}
