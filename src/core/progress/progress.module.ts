import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../libs/database/database.module';
import { ActivityLog } from './entities/activity-log.entity';
import { Badge } from './entities/badge.entity';
import { EarnedBadge } from './entities/earned-badge.entity';
import { ActivityLogsRepository } from './repositories/activity-logs.repository';
import { BadgesRepository } from './repositories/badges.repository';
import { EarnedBadgesRepository } from './repositories/earned-badges.repository';
import { ProgressService } from './progress.service';
import { ProgressController } from './progress.controller';
import { ProgressSeeder } from './progress.seeder';
import { ProfilesModule } from '../profiles/profiles.module';

@Module({
    imports: [
        DatabaseModule.forFeature([ActivityLog, Badge, EarnedBadge]),
        ProfilesModule,
    ],
    controllers: [ProgressController],
    providers: [
        ActivityLogsRepository,
        BadgesRepository,
        EarnedBadgesRepository,
        ProgressService,
        ProgressSeeder,
    ],
    exports: [
        ProgressService,
        ProgressSeeder,
        ActivityLogsRepository,
        BadgesRepository,
        EarnedBadgesRepository,
    ],
})
export class ProgressModule {}
