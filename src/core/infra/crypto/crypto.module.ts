import { Global, Module } from '@nestjs/common';
import { BcryptService } from './bcrypt/bcrypt.service';

@Global()
@Module({
  providers: [
    {
      provide: 'ICryptography',
      useClass: BcryptService,
    },
  ],
  exports: [
    {
      provide: 'ICryptography',
      useClass: BcryptService,
    },
  ],
})
export class CryptoModule {}
