import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { ProfilesModule } from '../profiles/profiles.module';
import { StoriesModule } from '../stories/stories.module';
import { GamesModule } from '../games/games.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { ProgressModule } from '../progress/progress.module';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';

@Module({
  imports: [
    UsersModule,
    ProfilesModule,
    StoriesModule,
    GamesModule,
    SubscriptionsModule,
    ProgressModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
