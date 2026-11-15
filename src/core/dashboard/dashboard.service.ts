import { Injectable } from '@nestjs/common';
import { ChildProfilesRepository } from '../profiles/repositories/child-profiles.repository';
import { Users } from '../users/entities/users.entity';

@Injectable()
export class DashboardService {
  constructor(
    private readonly childProfilesRepository: ChildProfilesRepository,
  ) {}

  async getParentDashboard(parent: Users) {
    const children = await this.childProfilesRepository.find({
      where: { parent: { id: parent.id }, deleted: false },
    });

    const totalStars = children.reduce(
      (sum, child) => sum + (child.stars || 0),
      0,
    );
    const totalScreenTimeUsedToday = children.reduce(
      (sum, child) => sum + (child.dailyScreenTimeUsedMinutes || 0),
      0,
    );

    return {
      parent: {
        id: parent.id,
        fullname: parent.fullname,
        email: parent.email,
        plan: parent.plan,
        premiumUntil: parent.premiumUntil,
      },
      summary: {
        totalChildren: children.length,
        totalStars,
        totalScreenTimeUsedTodayMinutes: totalScreenTimeUsedToday,
      },
      children: children.map((c) => ({
        id: c.id,
        name: c.name,
        avatar: c.avatar,
        ageGroup: c.ageGroup,
        language: c.preferredLanguage,
        stars: c.stars,
        level: c.level,
        screenTimeLimitMinutes: c.screenTimeLimitMinutes,
        dailyScreenTimeUsedMinutes: c.dailyScreenTimeUsedMinutes,
        screenTimeRemainingMinutes: Math.max(
          0,
          (c.screenTimeLimitMinutes || 30) -
            (c.dailyScreenTimeUsedMinutes || 0),
        ),
      })),
    };
  }
}
