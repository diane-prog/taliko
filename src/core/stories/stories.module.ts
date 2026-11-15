import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../libs/database/database.module';
import { Story } from './entities/story.entity';
import { StoryNode } from './entities/story-node.entity';
import { StoryChoice } from './entities/story-choice.entity';
import { StoryAudioTrack } from './entities/story-audio-track.entity';
import { StoriesRepository } from './repositories/stories.repository';
import { StoryNodesRepository } from './repositories/story-nodes.repository';
import { StoriesService } from './stories.service';
import { StoriesController } from './stories.controller';

@Module({
  imports: [
    DatabaseModule.forFeature([Story, StoryNode, StoryChoice, StoryAudioTrack]),
  ],
  controllers: [StoriesController],
  providers: [StoriesRepository, StoryNodesRepository, StoriesService],
  exports: [StoriesService, StoriesRepository],
})
export class StoriesModule {}
