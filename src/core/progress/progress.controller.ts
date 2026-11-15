import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProgressService } from './progress.service';
import { LogActivityDto } from './dto/log-activity.dto';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('progress')
@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Public()
  @Post('log-activity')
  @ApiOperation({
    summary:
      'Log an educational activity for a child profile and automatically evaluate cultural badges',
  })
  logActivity(@Body() dto: LogActivityDto) {
    return this.progressService.logActivity(dto);
  }

  @Public()
  @Get(':profileId')
  @ApiOperation({
    summary:
      'Get child progress history, earned badges (Petit Griot, etc.), and activity metrics',
  })
  getProfileProgress(@Param('profileId') profileId: string) {
    return this.progressService.getProfileProgress(profileId);
  }
}
