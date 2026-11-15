import { Injectable, Logger } from '@nestjs/common';
import { BadgesRepository } from './repositories/badges.repository';
import { Badge } from './entities/badge.entity';
import { ActivityTypeEnum } from './entities/activity-log.entity';

@Injectable()
export class ProgressSeeder {
  private readonly logger = new Logger(ProgressSeeder.name);

  constructor(private readonly badgesRepository: BadgesRepository) {}

  async seed(): Promise<void> {
    const defaultBadges = [
      {
        slug: 'petit_griot',
        title: 'Petit Griot',
        description: 'A écouté son tout premier conte africain.',
        icon: 'badge-griot',
        activityType: ActivityTypeEnum.STORY,
        requiredCount: 1,
      },
      {
        slug: 'conteur_du_village',
        title: 'Conteur du Village',
        description: 'A terminé 5 contes africains avec succès.',
        icon: 'badge-village',
        activityType: ActivityTypeEnum.STORY,
        requiredCount: 5,
      },
      {
        slug: 'genie_des_nombres',
        title: 'Génie des Nombres',
        description: 'A résolu 3 défis mathématiques.',
        icon: 'badge-math',
        activityType: ActivityTypeEnum.GAME,
        requiredCount: 3,
      },
      {
        slug: 'artiste_de_la_savane',
        title: 'Artiste de la Savane',
        description: 'A colorié ou dessiné 2 créations artistiques.',
        icon: 'badge-artist',
        activityType: ActivityTypeEnum.COLORING,
        requiredCount: 2,
      },
      {
        slug: 'maitre_du_rythme',
        title: 'Maître du Rythme',
        description: 'A découvert 2 instruments traditionnels africains.',
        icon: 'badge-music',
        activityType: ActivityTypeEnum.MUSIC,
        requiredCount: 2,
      },
    ];

    for (const data of defaultBadges) {
      const existing = await this.badgesRepository.findOne({
        where: { slug: data.slug },
      });

      if (!existing) {
        const badge = new Badge(data);
        await this.badgesRepository.create(badge);
        this.logger.log(`Seeded badge: ${data.title}`);
      }
    }
  }
}
