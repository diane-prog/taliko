import { Injectable } from '@nestjs/common';
import { SubscriptionsRepository } from './repositories/subscriptions.repository';
import { UsersService } from '../users/users.service';
import {
  PaymentMethodEnum,
  Subscription,
  SubscriptionPlanEnum,
  SubscriptionStatusEnum,
} from './entities/subscription.entity';
import { Users } from '../users/entities/users.entity';

@Injectable()
export class SubscriptionsService {
  constructor(
    private readonly subscriptionsRepository: SubscriptionsRepository,
    private readonly usersService: UsersService,
  ) {}

  async initiateSubscription(
    user: Users,
    plan: SubscriptionPlanEnum,
    paymentMethod: PaymentMethodEnum,
  ): Promise<Subscription> {
    let amount = 2500;
    let durationDays = 30;

    if (plan === SubscriptionPlanEnum.FAMILY_YEARLY) {
      amount = 24000;
      durationDays = 365;
    } else if (plan === SubscriptionPlanEnum.SCHOOL_LICENSE) {
      amount = 150000;
      durationDays = 365;
    }

    const now = new Date();
    const endDate = new Date(
      now.getTime() + durationDays * 24 * 60 * 60 * 1000,
    );

    const subscription = new Subscription({
      user,
      plan,
      paymentMethod,
      amountXof: amount,
      status: SubscriptionStatusEnum.ACTIVE,
      startDate: now,
      endDate,
      transactionReference: `TALIKO-${Date.now()}`,
    });

    const saved = await this.subscriptionsRepository.create(subscription);

    // Update user's premium status
    await this.usersService.update(user.id, {
      plan,
      premiumUntil: endDate,
      childrenLimit: plan === SubscriptionPlanEnum.SCHOOL_LICENSE ? 50 : 8,
    });

    return saved;
  }

  async getActiveSubscription(userId: string): Promise<Subscription | null> {
    return this.subscriptionsRepository.findOne({
      where: {
        user: { id: userId },
        status: SubscriptionStatusEnum.ACTIVE,
        deleted: false,
      },
      order: { createdAt: 'DESC' },
    });
  }
}
