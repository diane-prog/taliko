import { Injectable } from '@nestjs/common';
import { ActivityLogsRepository } from './repositories/activity-logs.repository';
import { BadgesRepository } from './repositories/badges.repository';
import { EarnedBadgesRepository } from './repositories/earned-badges.repository';
import { ChildProfilesRepository } from '../profiles/repositories/child-profiles.repository';
import { ProfilesService } from '../profiles/profiles.service';
import { LogActivityDto } from './dto/log-activity.dto';
import { ActivityLog } from './entities/activity-log.entity';
import { EarnedBadge } from './entities/earned-badge.entity';
import { Badge } from './entities/badge.entity';
import { ErrorHandlingService } from '../../common/response/errorHandler.service';
import { LanguageEnum } from '../../common/enum/languages.enum';

@Injectable()
export class ProgressService {
  constructor(
    private readonly activityLogsRepository: ActivityLogsRepository,
    private readonly badgesRepository: BadgesRepository,
    private readonly earnedBadgesRepository: EarnedBadgesRepository,
    private readonly childProfilesRepository: ChildProfilesRepository,
    private readonly profilesService: ProfilesService,
    private readonly errorHandler: ErrorHandlingService,
  ) {}

  async logActivity(dto: LogActivityDto): Promise<{
    log: ActivityLog;
    newBadges: Badge[];
  }> {
    const profile = await this.childProfilesRepository.findOne({
      where: { id: dto.profileId, deleted: false },
    });

    if (!profile) {
      this.errorHandler.returnErrorOnNotFound(
        `Profile ${dto.profileId} not found during activity logging`,
        'Child profile not found',
      );
    }

    const log = new ActivityLog({
      profile: profile!,
      activityType: dto.activityType,
      referenceId: dto.referenceId,
      durationSeconds: dto.durationSeconds,
      starsEarned: dto.starsEarned || 0,
      language: dto.language || LanguageEnum.FRENCH,
    });

    const savedLog = await this.activityLogsRepository.create(log);

    if ((dto.starsEarned || 0) > 0) {
      await this.profilesService.addStars(dto.profileId, dto.starsEarned!);
    }

    const newBadges = await this.checkForBadges(profile!.id, dto.activityType);

    return {
      log: savedLog,
      newBadges,
    };
  }

  private async checkForBadges(
    profileId: string,
    activityType: string,
  ): Promise<Badge[]> {
    const eligibleBadges = await this.badgesRepository.find({
      where: { activityType: activityType as any, deleted: false },
    });

    const alreadyEarned = await this.earnedBadgesRepository.find({
      where: { profile: { id: profileId }, deleted: false },
    });
    const earnedBadgeIds = new Set(alreadyEarned.map((eb) => eb.badge.id));

    const newlyUnlocked: Badge[] = [];
    const activityCount = await this.activityLogsRepository.count({
      where: {
        profile: { id: profileId },
        activityType: activityType as any,
        deleted: false,
      },
    });

    for (const badge of eligibleBadges) {
      if (
        !earnedBadgeIds.has(badge.id) &&
        activityCount >= badge.requiredCount
      ) {
        const profile = await this.childProfilesRepository.findOne({
          where: { id: profileId },
        });
        const earned = new EarnedBadge({
          profile: profile!,
          badge,
        });
        await this.earnedBadgesRepository.create(earned);
        newlyUnlocked.push(badge);
      }
    }

    return newlyUnlocked;
  }

  async getProfileProgress(profileId: string) {
    const profile = await this.childProfilesRepository.findOne({
      where: { id: profileId, deleted: false },
    });

    if (!profile) {
      this.errorHandler.returnErrorOnNotFound(
        `Profile ${profileId} not found`,
        'Child profile not found',
      );
    }

    const logs = await this.activityLogsRepository.find({
      where: { profile: { id: profileId }, deleted: false },
      order: { createdAt: 'DESC' },
      take: 50,
    });

    const earnedBadges = await this.earnedBadgesRepository.find({
      where: { profile: { id: profileId }, deleted: false },
      order: { earnedAt: 'DESC' },
    });

    const totalSeconds = logs.reduce(
      (sum, l) => sum + (l.durationSeconds || 0),
      0,
    );

    return {
      profile: {
        id: profile!.id,
        name: profile!.name,
        stars: profile!.stars,
        level: profile!.level,
      },
      summary: {
        totalActivities: logs.length,
        totalMinutesSpent: Math.round(totalSeconds / 60),
        badgesEarnedCount: earnedBadges.length,
      },
      badges: earnedBadges.map((eb) => ({
        id: eb.badge.id,
        title: eb.badge.title,
        description: eb.badge.description,
        icon: eb.badge.icon,
        earnedAt: eb.earnedAt,
      })),
      recentLogs: logs,
    };
  }
}
