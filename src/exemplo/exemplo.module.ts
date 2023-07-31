import { Module } from '@nestjs/common';
import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm';

import { ExemploService } from './exemplo.service';
import { SharedModule } from 'src/shared/shared.module';
import { ExemploController } from './exemplo.controller';
import { ExemploTypeOrm } from './entities/typeorm/exemplo.entity';
import { ExemploAuditTypeOrm } from './entities/typeorm/exemplo-audit.sentity';
import { DataSource } from 'typeorm';
import { ExemploRepository } from './repository/repository';
import { IExemploRepository } from './interfaces/exemplo-repository.interface';
import { IExemploService } from './interfaces/exemplo-service.interface';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExemploTypeOrm, ExemploAuditTypeOrm]),
    SharedModule,
  ],
  controllers: [ExemploController],
  providers: [
    ExemploService,
    {
      provide: IExemploRepository,
      useFactory: (dataSource: DataSource) => {
        return ExemploRepository.createInstance(
          dataSource.getRepository(ExemploTypeOrm),
          dataSource.getRepository(ExemploAuditTypeOrm),
        );
      },
      inject: [getDataSourceToken()],
    },
    {
      provide: IExemploService,
      useClass: ExemploService,
    },
  ],
})
export class ExemploModule {}
