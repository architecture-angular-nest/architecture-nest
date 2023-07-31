import { Global, Module } from '@nestjs/common';

import { Bcrypt } from './bcrypt/bcrypt';
import { ICryptography } from './interfaces/cryptography.interface';

@Global()
@Module({
  providers: [
    {
      provide: ICryptography,
      useClass: Bcrypt,
    },
  ],
  exports: [
    {
      provide: ICryptography,
      useClass: Bcrypt,
    },
  ],
})
export class CryptoModule {}
