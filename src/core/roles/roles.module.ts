import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../libs/database/database.module';
import { Roles } from './entities/roles.entity';
import { RolesRepository } from './repositories/roles.repository';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { RolesSeeder } from './roles.seeder';

@Module({
  imports: [DatabaseModule.forFeature([Roles])],
  controllers: [RolesController],
  providers: [RolesRepository, RolesService, RolesSeeder],
  exports: [RolesService, RolesRepository, RolesSeeder],
})
export class RolesModule {}
