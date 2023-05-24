import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilityService } from './services/utility.service';

@Global()
@Module({
  imports: [TypeOrmModule],
  providers: [UtilityService],
  exports: [UtilityService],
})
export class SharedModule {}
