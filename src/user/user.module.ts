import { Module } from '@nestjs/common';
import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm';

import { DataSource } from 'typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SharedModule } from './../shared/shared.module';
import { UserRepository } from './repository/repository';
import { UserTypeOrm } from './entities/typeorm/user.entity';
import { IUserService } from './interfaces/user-service.interface';
import { UserAuditTypeOrm } from './entities/typeorm/user-audit.entity';
import { IUserRepository } from './interfaces/user-repository.interface';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserTypeOrm, UserAuditTypeOrm]),
    SharedModule,
  ],
  controllers: [UserController],
  providers: [
    {
      provide: IUserRepository,
      useFactory: (dataSource: DataSource) => {
        return UserRepository.createInstance(
          dataSource.getRepository(UserTypeOrm),
          dataSource.getRepository(UserAuditTypeOrm),
        );
      },
      inject: [getDataSourceToken()],
    },
    {
      provide: IUserService,
      useClass: UserService,
    },
  ],
  exports: [
    {
      provide: IUserService,
      useClass: UserService,
    },
  ],
})
export class UserModule {}
