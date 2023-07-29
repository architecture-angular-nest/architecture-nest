import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UserTypeOrm } from './entities/typeorm/user.entity';
import { IUserService } from './interfaces/user-service.interface';
import { EntityId } from '../core/architecture/types/enity-id.type';
import { UtilityService } from './../shared/services/utility.service';
import { UserAuditTypeOrm } from './entities/typeorm/user-audit.entity';
import { IUserRepository } from './interfaces/user-repository.interface';
import { ICryptography } from './../core/infra/crypto/interfaces/cryptography.interface';
import { CrudWithAuditService } from 'src/core/architecture/services/crud-with-audit.service';

@Injectable()
export class UserService
  extends CrudWithAuditService<
    UserTypeOrm,
    UserAuditTypeOrm,
    EntityId,
    CreateUserDto
  >
  implements IUserService
{
  constructor(
    private readonly userRepository: IUserRepository<
      UserTypeOrm,
      UserAuditTypeOrm
    >,
    private readonly utilityService: UtilityService,
    private readonly cryptography: ICryptography,
  ) {
    super(userRepository);
  }

  public async createEntity(
    createEntityDto: CreateUserDto,
    actionDoneBy?: Express.User,
  ): Promise<UserTypeOrm> {
    const emailUserAlreadyExists = await this.userRepository.findByEmail(
      createEntityDto.email.toLowerCase(),
    );
    if (emailUserAlreadyExists) {
      throw new HttpException(
        'E-mail already registered',
        HttpStatus.BAD_REQUEST,
      );
    }

    const createdUser: UserTypeOrm = await this.createEntity(
      {
        ...createEntityDto,
        email: createEntityDto.email.toLowerCase(),
        password: await this.cryptography.hash(createEntityDto.password, 10),
      },
      actionDoneBy['id'],
    );
    const resturnedUser: UserTypeOrm =
      this.utilityService.changeObjectNullValuesToUndefined(
        createdUser,
      ) as UserTypeOrm;

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

    return this.userRepository.findOneWithEspacificFildsByEmail(
      formatedFilds,
      email.toLowerCase(),
    );
  }
}
