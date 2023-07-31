import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { User } from './entities/user';
import { UserAudit } from './entities/user-audit';
import { CreateUserDto } from './dto/create-user.dto';
import { IUserService } from './interfaces/user-service.interface';
import { EntityId } from '../core/architecture/types/enity-id.type';
import { IUserRepository } from './interfaces/user-repository.interface';
import { ICryptography } from './../core/infra/crypto/interfaces/cryptography.interface';
import { CrudWithAuditService } from 'src/core/architecture/services/crud-with-audit.service';

@Injectable()
export class UserService
  extends CrudWithAuditService<User, UserAudit, EntityId, CreateUserDto>
  implements IUserService
{
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly cryptography: ICryptography,
  ) {
    super(userRepository);
  }

  public async createEntity(
    createEntityDto: CreateUserDto,
    actionDoneBy?: Express.User,
  ): Promise<User> {
    const emailUserAlreadyExists = await this.userRepository.findByEmail(
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
        password: await this.cryptography.hash(createEntityDto.password, 10),
      },
      actionDoneBy['id'],
    );

    return {
      ...createdUser,
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

    return this.userRepository.findOneWithEspacificFildsByEmail(
      formatedFilds,
      email.toLowerCase(),
    );
  }
}
