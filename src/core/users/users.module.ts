import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from '../../libs/database/database.module';
import { Users } from './entities/users.entity';
import { UsersRepository } from './repositories/users.repository';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersSeeder } from './users.seeder';
import { RolesModule } from '../roles/roles.module';
import { ProfilesModule } from '../profiles/profiles.module';

@Module({
    imports: [
        DatabaseModule.forFeature([Users]),
        forwardRef(() => RolesModule),
        forwardRef(() => ProfilesModule),
    ],
    controllers: [UsersController],
    providers: [UsersRepository, UsersService, UsersSeeder],
    exports: [UsersService, UsersRepository, UsersSeeder],
})
export class UsersModule {}
