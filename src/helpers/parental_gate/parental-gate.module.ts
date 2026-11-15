import { Global, Module } from '@nestjs/common';
import { ParentalGateService } from './parental-gate.service';

@Global()
@Module({
  providers: [ParentalGateService],
  exports: [ParentalGateService],
})
export class ParentalGateModule {}
