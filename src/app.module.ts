import { Bcrypt } from './core/infra/crypto/bcrypt/bcrypt';
import { CryptoModule } from './core/infra/crypto/crypto.module';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
import { AuthModule } from './core/auth/auth.module';
import { ExemploModule } from './exemplo/exemplo.module';
import { dataSourceOptions } from './core/infra/database/data-source';
import { JwtAuthGuard } from './core/auth/guards/jwt-auth.guard';

@Module({
  imports: [
    CryptoModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      ...dataSourceOptions,
      autoLoadEntities: true,
    }),
    ExemploModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
