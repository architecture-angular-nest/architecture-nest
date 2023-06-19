import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import * as dotenv from 'dotenv';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from './../../user/user.module';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: process.env.SECRET_TOKEN,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
