import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ExemploService } from './exemplo.service';
import { SharedModule } from 'src/shared/shared.module';
import { ExemploController } from './exemplo.controller';
import { Exemplo } from './entities/typeorm/exemplo.schema';
import { ExemploAudit } from './entities/typeorm/exemplo-audit.schema';

@Module({
  imports: [TypeOrmModule.forFeature([Exemplo, ExemploAudit]), SharedModule],
  controllers: [ExemploController],
  providers: [ExemploService],
})
export class ExemploModule {}
