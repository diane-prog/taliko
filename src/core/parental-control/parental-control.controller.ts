import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ParentalControlService } from './parental-control.service';
import { HeartbeatDto } from './dto/heartbeat.dto';
import { UnlockExtraTimeDto } from './dto/unlock-extra-time.dto';
import { Public } from '../../common/decorators/public.decorator';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Users } from '../users/entities/users.entity';
import { ParentalGateService } from '../../helpers/parental_gate/parental-gate.service';

@ApiTags('parental-control')
@Controller('parental-control')
export class ParentalControlController {
  constructor(
    private readonly parentalControlService: ParentalControlService,
    private readonly parentalGateService: ParentalGateService,
  ) {}

  @Public()
  @Post('heartbeat')
  @ApiOperation({
    summary: 'Heartbeat ping sent by child app to track screen time',
  })
  heartbeat(@Body() dto: HeartbeatDto) {
    return this.parentalControlService.processHeartbeat(dto);
  }

  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Post('unlock-extra-time')
  @ApiOperation({
    summary: 'Unlock additional screen time using 4-digit parental PIN',
  })
  unlockExtraTime(
    @CurrentUser() parent: Users,
    @Body() dto: UnlockExtraTimeDto,
  ) {
    return this.parentalControlService.unlockExtraTime(parent, dto);
  }

  @Public()
  @Get('gate-challenge')
  @ApiOperation({
    summary: 'Generate an adult arithmetic challenge for the parental gate',
  })
  getChallenge() {
    return this.parentalGateService.generateChallenge();
  }

  @Public()
  @Post('verify-gate-challenge')
  @ApiOperation({
    summary: 'Verify the solution to a parental math challenge',
  })
  async verifyChallenge(@Body() body: { challengeId: string; answer: number }) {
    const isValid = await this.parentalGateService.verifyChallenge(
      body.challengeId,
      body.answer,
    );
    return { valid: isValid };
  }
}
