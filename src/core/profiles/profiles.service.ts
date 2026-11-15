import { Injectable } from '@nestjs/common';
import { ChildProfilesRepository } from './repositories/child-profiles.repository';
import { CreateChildProfileDto } from './dto/create-child-profile.dto';
import { UpdateChildProfileDto } from './dto/update-child-profile.dto';
import { ChildProfile } from './entities/child-profile.entity';
import { ErrorHandlingService } from '../../common/response/errorHandler.service';
import { Users } from '../users/entities/users.entity';

@Injectable()
export class ProfilesService {
  constructor(
    private readonly childProfilesRepository: ChildProfilesRepository,
    private readonly errorHandler: ErrorHandlingService,
  ) {}

  async createForParent(
    parent: Users,
    dto: CreateChildProfileDto,
  ): Promise<ChildProfile> {
    const currentCount = await this.childProfilesRepository.count({
      where: { parent: { id: parent.id }, deleted: false },
    });

    if (currentCount >= (parent.childrenLimit ?? 4)) {
      this.errorHandler.returnErrorOnBadRequest(
        `Parent ${parent.id} exceeded max children limit`,
        `Maximum children profiles limit (${parent.childrenLimit ?? 4}) reached. Please upgrade your plan.`,
      );
    }

    const today = new Date().toISOString().split('T')[0];
    const profile = new ChildProfile({
      ...dto,
      parent,
      lastScreenTimeDate: today,
      dailyScreenTimeUsedMinutes: 0,
    });

    return this.childProfilesRepository.create(profile);
  }

  async findAllForParent(parentId: string): Promise<ChildProfile[]> {
    return this.childProfilesRepository.find({
      where: { parent: { id: parentId }, deleted: false },
      order: { createdAt: 'ASC' },
    });
  }

  async findOneForParent(
    parentId: string,
    profileId: string,
  ): Promise<ChildProfile> {
    const profile = await this.childProfilesRepository.findOne({
      where: { id: profileId, parent: { id: parentId }, deleted: false },
    });

    if (!profile) {
      this.errorHandler.returnErrorOnNotFound(
        `Profile ${profileId} not found for parent ${parentId}`,
        'Child profile not found',
      );
    }

    return profile!;
  }

  async updateForParent(
    parentId: string,
    profileId: string,
    dto: UpdateChildProfileDto,
  ): Promise<ChildProfile> {
    await this.findOneForParent(parentId, profileId);
    const updated = await this.childProfilesRepository.update(
      { id: profileId },
      dto,
    );
    return updated!;
  }

  async removeForParent(parentId: string, profileId: string): Promise<string> {
    await this.findOneForParent(parentId, profileId);
    await this.childProfilesRepository.softDelete({ id: profileId });
    return `Profile ${profileId} deleted successfully`;
  }

  async addStars(profileId: string, points: number): Promise<ChildProfile> {
    const profile = await this.childProfilesRepository.findOne({
      where: { id: profileId, deleted: false },
    });

    if (!profile) {
      this.errorHandler.returnErrorOnNotFound(
        `Profile ${profileId} not found`,
        'Child profile not found',
      );
    }

    const newStars = (profile!.stars || 0) + points;
    const newLevel = Math.floor(newStars / 100) + 1;

    return (await this.childProfilesRepository.update(
      { id: profileId },
      { stars: newStars, level: newLevel },
    ))!;
  }
}
