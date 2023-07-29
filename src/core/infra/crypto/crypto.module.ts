import { Global, Module } from '@nestjs/common';

import { Bcrypt } from './bcrypt/bcrypt';

@Global()
@Module({
  providers: [
    {
      provide: 'ICryptography',
      useClass: Bcrypt,
    },
  ],
  exports: [
    {
      provide: 'ICryptography',
      useClass: Bcrypt,
    },
  ],
})
export class CryptoModule {}
