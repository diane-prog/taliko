import { Injectable } from '@nestjs/common';
import { ColoringTemplatesRepository } from './repositories/coloring-templates.repository';
import { KidArtworksRepository } from './repositories/kid-artworks.repository';
import { ColoringTemplate } from './entities/coloring-template.entity';
import { KidArtwork } from './entities/kid-artwork.entity';
import { AgeGroupEnum } from '../../common/enum/age-group.enum';
import { ErrorHandlingService } from '../../common/response/errorHandler.service';
import { ChildProfilesRepository } from '../profiles/repositories/child-profiles.repository';

@Injectable()
export class CreativityService {
  constructor(
    private readonly templatesRepository: ColoringTemplatesRepository,
    private readonly artworksRepository: KidArtworksRepository,
    private readonly childProfilesRepository: ChildProfilesRepository,
    private readonly errorHandler: ErrorHandlingService,
  ) {}

  async getTemplates(
    category?: string,
    ageGroup?: AgeGroupEnum,
  ): Promise<ColoringTemplate[]> {
    const where: any = { deleted: false };
    if (category) {
      where.category = category;
    }
    if (ageGroup) {
      where.ageGroup = ageGroup;
    }
    return this.templatesRepository.find({ where });
  }

  async saveArtwork(
    profileId: string,
    data: { title: string; drawingDataUrl: string; templateId?: string },
  ): Promise<KidArtwork> {
    const profile = await this.childProfilesRepository.findOne({
      where: { id: profileId, deleted: false },
    });

    if (!profile) {
      this.errorHandler.returnErrorOnNotFound(
        `Profile ${profileId} not found`,
        'Child profile not found',
      );
    }

    const artwork = new KidArtwork({
      title: data.title || "Mon chef-d'œuvre",
      drawingDataUrl: data.drawingDataUrl,
      templateId: data.templateId,
      profile: profile!,
    });

    return this.artworksRepository.create(artwork);
  }

  async getArtworksForProfile(profileId: string): Promise<KidArtwork[]> {
    return this.artworksRepository.find({
      where: { profile: { id: profileId }, deleted: false },
      order: { createdAt: 'DESC' },
    });
  }

  async createTemplate(
    data: Partial<ColoringTemplate>,
  ): Promise<ColoringTemplate> {
    const template = new ColoringTemplate(data);
    return this.templatesRepository.create(template);
  }
}
