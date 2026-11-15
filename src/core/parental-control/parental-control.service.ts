import { Injectable } from '@nestjs/common';
import { ChildProfilesRepository } from '../profiles/repositories/child-profiles.repository';
import { PasswordHashService } from '../../helpers/password_hash/passwordHash.service';
import { ErrorHandlingService } from '../../common/response/errorHandler.service';
import { HeartbeatDto } from './dto/heartbeat.dto';
import { UnlockExtraTimeDto } from './dto/unlock-extra-time.dto';
import { Users } from '../users/entities/users.entity';

@Injectable()
export class ParentalControlService {
  constructor(
    private readonly childProfilesRepository: ChildProfilesRepository,
    private readonly passwordHashService: PasswordHashService,
    private readonly errorHandler: ErrorHandlingService,
  ) {}

  async processHeartbeat(dto: HeartbeatDto): Promise<{
    screenTimeExpired: boolean;
    remainingMinutes: number;
    dailyUsedMinutes: number;
    dailyLimitMinutes: number;
  }> {
    const profile = await this.childProfilesRepository.findOne({
      where: { id: dto.profileId, deleted: false },
    });

    if (!profile) {
      this.errorHandler.returnErrorOnNotFound(
        `Profile ${dto.profileId} not found during heartbeat`,
        'Child profile not found',
      );
    }

    const today = new Date().toISOString().split('T')[0];
    let dailyUsed = profile!.dailyScreenTimeUsedMinutes || 0;

    // Reset if new calendar day
    if (profile!.lastScreenTimeDate !== today) {
      dailyUsed = 0;
    }

    const increment = dto.minutesElapsed ?? 1;
    dailyUsed += increment;

    await this.childProfilesRepository.update(
      { id: profile!.id },
      {
        dailyScreenTimeUsedMinutes: dailyUsed,
        lastScreenTimeDate: today,
      },
    );

    const limit = profile!.screenTimeLimitMinutes || 30;
    const expired = dailyUsed >= limit;
    const remaining = Math.max(0, limit - dailyUsed);

    return {
      screenTimeExpired: expired,
      remainingMinutes: remaining,
      dailyUsedMinutes: dailyUsed,
      dailyLimitMinutes: limit,
    };
  }

  async unlockExtraTime(
    parent: Users,
    dto: UnlockExtraTimeDto,
  ): Promise<{
    success: boolean;
    newLimitMinutes: number;
    remainingMinutes: number;
  }> {
    const isPinValid = await this.passwordHashService.comparePassword(
      dto.pin,
      parent.parentalPinHash,
    );

    if (!isPinValid) {
      this.errorHandler.returnErrorOnForbidden(
        `Invalid PIN during screen time unlock for parent ${parent.id}`,
        'Incorrect parental PIN',
      );
    }

    const profile = await this.childProfilesRepository.findOne({
      where: { id: dto.profileId, parent: { id: parent.id }, deleted: false },
    });

    if (!profile) {
      this.errorHandler.returnErrorOnNotFound(
        `Profile ${dto.profileId} not found for parent ${parent.id}`,
        'Child profile not found under your account',
      );
    }

    const updatedLimit =
      (profile!.screenTimeLimitMinutes || 30) + dto.extraMinutes;

    await this.childProfilesRepository.update(
      { id: profile!.id },
      { screenTimeLimitMinutes: updatedLimit },
    );

    const used = profile!.dailyScreenTimeUsedMinutes || 0;
    const remaining = Math.max(0, updatedLimit - used);

    return {
      success: true,
      newLimitMinutes: updatedLimit,
      remainingMinutes: remaining,
    };
  }
}
