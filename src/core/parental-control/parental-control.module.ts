import { Module } from '@nestjs/common';
import { ProfilesModule } from '../profiles/profiles.module';
import { ParentalControlService } from './parental-control.service';
import { ParentalControlController } from './parental-control.controller';

@Module({
  imports: [ProfilesModule],
  controllers: [ParentalControlController],
  providers: [ParentalControlService],
  exports: [ParentalControlService],
})
export class ParentalControlModule {}
