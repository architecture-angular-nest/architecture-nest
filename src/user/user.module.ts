import { Module } from '@nestjs/common';
import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm';

import { DataSource } from 'typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SharedModule } from './../shared/shared.module';
import { UserRepository } from './repository/repository';
import { UserTypeOrm } from './entities/typeorm/user.entity';
import { UtilityService } from './../shared/services/utility.service';
import { UserAuditTypeOrm } from './entities/typeorm/user-audit.entity';
import { IUserRepository } from './interfaces/user-repository.interface';
import { ICryptography } from './../core/infra/crypto/interfaces/cryptography.interface';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserTypeOrm, UserAuditTypeOrm]),
    SharedModule,
  ],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: UserRepository,
      useFactory: (dataSource: DataSource) => {
        return new UserRepository(
          dataSource.getRepository(UserTypeOrm),
          dataSource.getRepository(UserAuditTypeOrm),
        );
      },
      inject: [getDataSourceToken()],
    },
    {
      provide: UserService,
      useFactory: (
        userRepository: IUserRepository<UserTypeOrm, UserAuditTypeOrm>,
        utilityService: UtilityService,
        cryptography: ICryptography,
      ) => {
        return new UserService(userRepository, utilityService, cryptography);
      },
      inject: [UserRepository, UtilityService, 'ICryptography'],
    },
  ],
  exports: [UserService],
})
export class UserModule {}
