import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { AuthModule } from './core/auth/auth.module';
import { ExemploModule } from './exemplo/exemplo.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db',
      entities: ['dist/**/*.entity.js'],
      autoLoadEntities: true,
      synchronize: true,
    }),
    ExemploModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
