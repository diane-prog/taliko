import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';
import {
  PaymentMethodEnum,
  SubscriptionPlanEnum,
} from './entities/subscription.entity';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Users } from '../users/entities/users.entity';

@ApiTags('subscriptions')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post('subscribe')
  @ApiOperation({
    summary:
      'Subscribe to Family Premium or School plan using Mobile Money / Card (FCFA)',
  })
  subscribe(
    @CurrentUser() user: Users,
    @Body()
    body: {
      plan: SubscriptionPlanEnum;
      paymentMethod: PaymentMethodEnum;
    },
  ) {
    return this.subscriptionsService.initiateSubscription(
      user,
      body.plan,
      body.paymentMethod,
    );
  }

  @Get('current')
  @ApiOperation({ summary: 'Get current active subscription status' })
  getCurrent(@CurrentUser() user: Users) {
    return this.subscriptionsService.getActiveSubscription(user.id);
  }
}
