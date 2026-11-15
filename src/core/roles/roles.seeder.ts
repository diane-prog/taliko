import { Injectable, Logger } from '@nestjs/common';
import { RolesRepository } from './repositories/roles.repository';
import { Roles } from './entities/roles.entity';
import { UserRoleEnum } from '../../common/enum/user.enum';

@Injectable()
export class RolesSeeder {
  private readonly logger = new Logger(RolesSeeder.name);

  constructor(private readonly rolesRepository: RolesRepository) {}

  async seed(): Promise<void> {
    const defaultRoles = [
      {
        label: UserRoleEnum.SUPER_ADMIN,
        description: 'Full platform administration',
      },
      {
        label: UserRoleEnum.ADMIN,
        description: 'Content and school management',
      },
      {
        label: UserRoleEnum.TEACHER,
        description: 'Educator or school partner profile',
      },
      {
        label: UserRoleEnum.PARENT,
        description: 'Parent account managing child profiles',
      },
    ];

    for (const roleData of defaultRoles) {
      const existing = await this.rolesRepository.findOne({
        where: { label: roleData.label },
      });

      if (!existing) {
        const role = new Roles(roleData);
        await this.rolesRepository.create(role);
        this.logger.log(`Seeded role: ${roleData.label}`);
      }
    }
  }
}
