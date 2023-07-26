import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ExemploService } from './exemplo.service';
import { ExemploController } from './exemplo.controller';
import { Exemplo } from './entities/exemplo.entity';
import { ExemploAudit } from './entities/exemplo-audit.entity';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [TypeOrmModule.forFeature([Exemplo, ExemploAudit]), SharedModule],
  controllers: [ExemploController],
  providers: [ExemploService],
})
export class ExemploModule { }
