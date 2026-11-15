import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Users } from '../users/entities/users.entity';

@ApiTags('dashboard')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('parent')
  @ApiOperation({
    summary:
      'Get parent overview: screen time statistics, star progression, and child profiles',
  })
  getParentDashboard(@CurrentUser() parent: Users) {
    return this.dashboardService.getParentDashboard(parent);
  }
}
