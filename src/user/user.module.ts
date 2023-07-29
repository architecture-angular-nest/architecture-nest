import { CryptoModule } from './../core/infra/crypto/crypto.module';
import { Bcrypt } from '../core/infra/crypto/bcrypt/bcrypt';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserAudit } from './entities/user-audit.entity';
import { SharedModule } from './../shared/shared.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserAudit]), SharedModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
