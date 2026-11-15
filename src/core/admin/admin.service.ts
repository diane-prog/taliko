import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../users/repositories/users.repository';
import { ChildProfilesRepository } from '../profiles/repositories/child-profiles.repository';
import { StoriesRepository } from '../stories/repositories/stories.repository';
import { GameQuestionsRepository } from '../games/repositories/game-questions.repository';
import { SubscriptionsRepository } from '../subscriptions/repositories/subscriptions.repository';
import { ActivityLogsRepository } from '../progress/repositories/activity-logs.repository';
import { SubscriptionStatusEnum } from '../subscriptions/entities/subscription.entity';

@Injectable()
export class AdminService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly childProfilesRepository: ChildProfilesRepository,
    private readonly storiesRepository: StoriesRepository,
    private readonly questionsRepository: GameQuestionsRepository,
    private readonly subscriptionsRepository: SubscriptionsRepository,
    private readonly activityLogsRepository: ActivityLogsRepository,
  ) {}

  async getSystemMetrics() {
    const [
      totalUsers,
      totalChildren,
      totalStories,
      totalQuestions,
      totalActivities,
      activeSubscriptions,
    ] = await Promise.all([
      this.usersRepository.count({ where: { deleted: false } }),
      this.childProfilesRepository.count({ where: { deleted: false } }),
      this.storiesRepository.count({ where: { deleted: false } }),
      this.questionsRepository.count({ where: { deleted: false } }),
      this.activityLogsRepository.count({ where: { deleted: false } }),
      this.subscriptionsRepository.find({
        where: { status: SubscriptionStatusEnum.ACTIVE, deleted: false },
      }),
    ]);

    const totalRevenueXof = activeSubscriptions.reduce(
      (sum, sub) => sum + (sub.amountXof || 0),
      0,
    );

    return {
      platform: {
        totalParentsAndEducators: totalUsers,
        totalChildrenProfiles: totalChildren,
        totalInteractiveStories: totalStories,
        totalEducationalQuestions: totalQuestions,
        totalActivitiesCompleted: totalActivities,
      },
      subscriptions: {
        activeSubscribersCount: activeSubscriptions.length,
        totalMonthlyRevenueXof: totalRevenueXof,
      },
    };
  }
}
