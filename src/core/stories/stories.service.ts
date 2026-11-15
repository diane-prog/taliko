import { Injectable } from '@nestjs/common';
import { StoriesRepository } from './repositories/stories.repository';
import { StoryNodesRepository } from './repositories/story-nodes.repository';
import { Story } from './entities/story.entity';
import { StoryNode } from './entities/story-node.entity';
import { ErrorHandlingService } from '../../common/response/errorHandler.service';
import { LanguageEnum } from '../../common/enum/languages.enum';
import { AgeGroupEnum } from '../../common/enum/age-group.enum';

@Injectable()
export class StoriesService {
  constructor(
    private readonly storiesRepository: StoriesRepository,
    private readonly storyNodesRepository: StoryNodesRepository,
    private readonly errorHandler: ErrorHandlingService,
  ) {}

  async findAll(filter?: {
    ageGroup?: AgeGroupEnum;
    language?: LanguageEnum;
    isPremium?: boolean;
  }): Promise<Story[]> {
    const where: any = { deleted: false };

    if (filter?.ageGroup && Object.values(AgeGroupEnum).includes(filter.ageGroup)) {
      where.ageGroup = filter.ageGroup;
    }

    if (filter?.isPremium !== undefined) {
      where.isPremium = filter.isPremium;
    }

    const stories = await this.storiesRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });

    if (filter?.language) {
      return stories.filter((story) =>
        story.availableLanguages?.includes(filter.language!),
      );
    }

    return stories;
  }

  async findById(id: string): Promise<Story> {
    const story = await this.storiesRepository.findOne({
      where: { id, deleted: false },
      relations: { nodes: true },
    });

    if (!story) {
      this.errorHandler.returnErrorOnNotFound(
        `Story ${id} not found`,
        'Story not found',
      );
    }

    return story!;
  }

  async getNode(
    storyId: string,
    nodeId: string,
    preferredLanguage: LanguageEnum = LanguageEnum.FRENCH,
  ): Promise<{
    node: StoryNode;
    audioTrack: any;
    choices: any[];
  }> {
    const node = await this.storyNodesRepository.findOne({
      where: { id: nodeId, story: { id: storyId }, deleted: false },
      relations: {
        audioTracks: true,
        choices: true,
      },
    });

    if (!node) {
      this.errorHandler.returnErrorOnNotFound(
        `Node ${nodeId} not found in story ${storyId}`,
        'Story scene not found',
      );
    }

    // Match requested language audio track or fallback to first available
    const audioTrack =
      node!.audioTracks.find((t) => t.language === preferredLanguage) ??
      node!.audioTracks[0] ??
      null;

    return {
      node: node!,
      audioTrack,
      choices: node!.choices || [],
    };
  }

  async create(storyData: Partial<Story>): Promise<Story> {
    const story = new Story(storyData);
    return this.storiesRepository.create(story);
  }

  async createNode(
    storyId: string,
    nodeData: Partial<StoryNode>,
  ): Promise<StoryNode> {
    const story = await this.findById(storyId);
    const node = new StoryNode({ ...nodeData, story });
    const savedNode = await this.storyNodesRepository.create(node);

    if (!story.rootNodeId) {
      await this.storiesRepository.update(
        { id: storyId },
        { rootNodeId: savedNode.id },
      );
    }

    return savedNode;
  }
}
