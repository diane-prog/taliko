import { Injectable } from '@nestjs/common';
import { RolesRepository } from './repositories/roles.repository';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Roles } from './entities/roles.entity';
import { ErrorHandlingService } from '../../common/response/errorHandler.service';

@Injectable()
export class RolesService {
  constructor(
    private readonly rolesRepository: RolesRepository,
    private readonly errorHandler: ErrorHandlingService,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Roles> {
    const existing = await this.rolesRepository.findOne({
      where: { label: createRoleDto.label, deleted: false },
    });

    if (existing) {
      this.errorHandler.returnErrorOnConflict(
        `Role ${createRoleDto.label} already exists`,
        `Role ${createRoleDto.label} already exists`,
      );
    }

    const role = new Roles(createRoleDto);
    return this.rolesRepository.create(role);
  }

  async findAll(): Promise<Roles[]> {
    return this.rolesRepository.find({
      where: { deleted: false },
    });
  }

  async findOne(id: string): Promise<Roles> {
    const role = await this.rolesRepository.findOne({
      where: { id, deleted: false },
    });

    if (!role) {
      this.errorHandler.returnErrorOnNotFound(
        `Role with id ${id} not found`,
        `Role with id ${id} not found`,
      );
    }

    return role;
  }

  async findByLabel(label: string): Promise<Roles | null> {
    return this.rolesRepository.findOne({
      where: { label, deleted: false },
    });
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Roles> {
    await this.findOne(id);
    const updated = await this.rolesRepository.update({ id }, updateRoleDto);
    return updated!;
  }

  async remove(id: string): Promise<string> {
    await this.findOne(id);
    await this.rolesRepository.softDelete({ id });
    return `Role ${id} successfully deleted`;
  }
}
