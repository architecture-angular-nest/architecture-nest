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

@Module({
  imports: [
    TypeOrmModule.forFeature([ExemploTypeOrm, ExemploAuditTypeOrm]),
    SharedModule,
  ],
  controllers: [ExemploController],
  providers: [
    ExemploService,
    {
      provide: ExemploRepository,
      useFactory: (dataSource: DataSource) => {
        return ExemploRepository.createInstance(
          dataSource.getRepository(ExemploTypeOrm),
          dataSource.getRepository(ExemploAuditTypeOrm),
        );
      },
      inject: [getDataSourceToken()],
    },
    {
      provide: ExemploService,
      useFactory: (exemploRepository: IExemploRepository) => {
        return new ExemploService(exemploRepository);
      },
      inject: [ExemploRepository],
    },
  ],
})
export class ExemploModule {}
