import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../libs/database/database.module';
import { Subscription } from './entities/subscription.entity';
import { SubscriptionsRepository } from './repositories/subscriptions.repository';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [DatabaseModule.forFeature([Subscription]), UsersModule],
    controllers: [SubscriptionsController],
    providers: [SubscriptionsRepository, SubscriptionsService],
    exports: [SubscriptionsService, SubscriptionsRepository],
})
export class SubscriptionsModule {}
