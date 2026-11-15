import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../libs/database/database.module';
import { ChildProfile } from './entities/child-profile.entity';
import { ChildProfilesRepository } from './repositories/child-profiles.repository';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';

@Module({
  imports: [DatabaseModule.forFeature([ChildProfile])],
  controllers: [ProfilesController],
  providers: [ChildProfilesRepository, ProfilesService],
  exports: [ProfilesService, ChildProfilesRepository],
})
export class ProfilesModule {}
