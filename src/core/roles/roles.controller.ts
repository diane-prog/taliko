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
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { RequireRoles } from '../../common/decorators/roles.decorator';
import { UserRoleEnum } from '../../common/enum/user.enum';

@ApiTags('roles')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @RequireRoles(UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN)
  @ApiOperation({ summary: 'Create a new role' })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @RequireRoles(UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN)
  @ApiOperation({ summary: 'List all active roles' })
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @RequireRoles(UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN)
  @ApiOperation({ summary: 'Get a role by UUID' })
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @RequireRoles(UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN)
  @ApiOperation({ summary: 'Update a role' })
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @RequireRoles(UserRoleEnum.SUPER_ADMIN)
  @ApiOperation({ summary: 'Soft-delete a role' })
  remove(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }
}
