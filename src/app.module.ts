import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  appConfig,
  authConfig,
  databaseConfig,
  mailConfig,
  redisConfig,
  storageConfig,
} from './config';
import { DatabaseModule } from './libs/database/database.module';
import { RedisModule } from './libs/redis/redis.module';
import { MailerModule } from './libs/mailer/mailer.module';
import { LoggerModule } from './common/logger/logger.module';
import { ResponseModule } from './common/response/response.module';
import { PasswordHashModule } from './helpers/password_hash/passwordHash.module';
import { ParentalGateModule } from './helpers/parental_gate/parental-gate.module';
import { RolesModule } from './core/roles/roles.module';
import { UsersModule } from './core/users/users.module';
import { ProfilesModule } from './core/profiles/profiles.module';
import { AuthModule } from './core/auth/auth.module';
import { ParentalControlModule } from './core/parental-control/parental-control.module';
import { StoriesModule } from './core/stories/stories.module';
import { GamesModule } from './core/games/games.module';
import { CreativityModule } from './core/creativity/creativity.module';
import { AudioMusicModule } from './core/audio-music/audio-music.module';
import { ProgressModule } from './core/progress/progress.module';
import { MediaModule } from './core/media/media.module';
import { DashboardModule } from './core/dashboard/dashboard.module';
import { SubscriptionsModule } from './core/subscriptions/subscriptions.module';
import { AdminModule } from './core/admin/admin.module';
import { ContentSeeder } from './common/seeder/content.seeder';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        databaseConfig,
        authConfig,
        redisConfig,
        mailConfig,
        storageConfig,
      ],
    }),
    LoggerModule,
    ResponseModule,
    PasswordHashModule,
    ParentalGateModule,
    RedisModule,
    MailerModule,
    DatabaseModule,
    RolesModule,
    UsersModule,
    ProfilesModule,
    AuthModule,
    ParentalControlModule,
    StoriesModule,
    GamesModule,
    CreativityModule,
    AudioMusicModule,
    ProgressModule,
    MediaModule,
    DashboardModule,
    SubscriptionsModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService, ContentSeeder],
})
export class AppModule {}
