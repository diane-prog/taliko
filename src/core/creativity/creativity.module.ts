import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../libs/database/database.module';
import { ColoringTemplate } from './entities/coloring-template.entity';
import { KidArtwork } from './entities/kid-artwork.entity';
import { ColoringTemplatesRepository } from './repositories/coloring-templates.repository';
import { KidArtworksRepository } from './repositories/kid-artworks.repository';
import { CreativityService } from './creativity.service';
import { CreativityController } from './creativity.controller';
import { ProfilesModule } from '../profiles/profiles.module';

@Module({
  imports: [
    DatabaseModule.forFeature([ColoringTemplate, KidArtwork]),
    ProfilesModule,
  ],
  controllers: [CreativityController],
  providers: [
    ColoringTemplatesRepository,
    KidArtworksRepository,
    CreativityService,
  ],
  exports: [CreativityService],
})
export class CreativityModule {}
