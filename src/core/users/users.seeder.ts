import { Injectable, Logger } from '@nestjs/common';
import { UsersRepository } from './repositories/users.repository';
import { RolesRepository } from '../roles/repositories/roles.repository';
import { ChildProfilesRepository } from '../profiles/repositories/child-profiles.repository';
import { PasswordHashService } from '../../helpers/password_hash/passwordHash.service';
import { Users } from './entities/users.entity';
import { ChildProfile } from '../profiles/entities/child-profile.entity';
import { UserRoleEnum } from '../../common/enum/user.enum';
import { AgeGroupEnum } from '../../common/enum/age-group.enum';
import { LanguageEnum } from '../../common/enum/languages.enum';

@Injectable()
export class UsersSeeder {
    private readonly logger = new Logger(UsersSeeder.name);

    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly rolesRepository: RolesRepository,
        private readonly childProfilesRepository: ChildProfilesRepository,
        private readonly passwordHashService: PasswordHashService,
    ) {}

    async seed(): Promise<void> {
        const superAdminRole = await this.rolesRepository.findOne({
            where: { label: UserRoleEnum.SUPER_ADMIN },
        });

        const parentRole = await this.rolesRepository.findOne({
            where: { label: UserRoleEnum.PARENT },
        });

        if (!superAdminRole || !parentRole) {
            return;
        }

        const passwordHash = await this.passwordHashService.hashPassword('Admin123!');
        const pinHash = await this.passwordHashService.hashPassword('1234');

        // 1. Seed Super Admin
        const existingAdmin = await this.usersRepository.findOne({
            where: { email: 'admin@taliko.app' },
        });

        if (!existingAdmin) {
            const admin = new Users({
                fullname: 'Taliko Administrateur',
                email: 'admin@taliko.app',
                passwordHash,
                parentalPinHash: pinHash,
                role: superAdminRole,
                emailVerified: true,
                plan: 'school_license',
            });
            await this.usersRepository.create(admin);
            this.logger.log('Seeded demo admin: admin@taliko.app / Admin123! (PIN: 1234)');
        }

        // 2. Seed Demo Parent with children
        const parentPasswordHash = await this.passwordHashService.hashPassword(
            'Parent123!',
        );

        const existingParent = await this.usersRepository.findOne({
            where: { email: 'parent@taliko.app' },
            relations: { children: true },
        });

        if (!existingParent) {
            const parent = new Users({
                fullname: 'Amina & Kofi Diallo',
                email: 'parent@taliko.app',
                passwordHash: parentPasswordHash,
                parentalPinHash: pinHash,
                role: parentRole,
                emailVerified: true,
                plan: 'family_monthly',
                preferredLanguage: LanguageEnum.YORUBA,
                children: [],
            });

            const savedParent = await this.usersRepository.create(parent);

            // Create 2 children
            const child1 = new ChildProfile({
                name: 'Kofi',
                avatar: 'avatar-lion',
                ageGroup: AgeGroupEnum.EARLY_5_7,
                preferredLanguage: LanguageEnum.YORUBA,
                parent: savedParent,
                screenTimeLimitMinutes: 30,
                dailyScreenTimeUsedMinutes: 10,
                stars: 45,
                level: 1,
            });

            const child2 = new ChildProfile({
                name: 'Amina',
                avatar: 'avatar-gazelle',
                ageGroup: AgeGroupEnum.TODDLER_2_4,
                preferredLanguage: LanguageEnum.FON,
                parent: savedParent,
                screenTimeLimitMinutes: 20,
                dailyScreenTimeUsedMinutes: 5,
                stars: 20,
                level: 1,
            });

            await this.childProfilesRepository.create(child1);
            await this.childProfilesRepository.create(child2);

            this.logger.log(
                'Seeded demo parent: parent@taliko.app / Parent123! (PIN: 1234) with children Kofi & Amina',
            );
        }
    }
}
