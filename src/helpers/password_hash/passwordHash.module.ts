import { Global, Module } from '@nestjs/common';
import { PasswordHashService } from './passwordHash.service';

@Global()
@Module({
  providers: [PasswordHashService],
  exports: [PasswordHashService],
})
export class PasswordHashModule {}
