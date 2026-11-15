import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProfilesService } from './profiles.service';
import { CreateChildProfileDto } from './dto/create-child-profile.dto';
import { UpdateChildProfileDto } from './dto/update-child-profile.dto';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Users } from '../users/entities/users.entity';

@ApiTags('profiles')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new child profile for current parent' })
  create(@CurrentUser() parent: Users, @Body() dto: CreateChildProfileDto) {
    return this.profilesService.createForParent(parent, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all child profiles of current parent' })
  findAll(@CurrentUser() parent: Users) {
    return this.profilesService.findAllForParent(parent.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a child profile' })
  findOne(@CurrentUser() parent: Users, @Param('id') id: string) {
    return this.profilesService.findOneForParent(parent.id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update child profile settings' })
  update(
    @CurrentUser() parent: Users,
    @Param('id') id: string,
    @Body() dto: UpdateChildProfileDto,
  ) {
    return this.profilesService.updateForParent(parent.id, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft-delete a child profile' })
  remove(@CurrentUser() parent: Users, @Param('id') id: string) {
    return this.profilesService.removeForParent(parent.id, id);
  }
}
