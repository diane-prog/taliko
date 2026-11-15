import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { AbstractRepository } from '../../../libs/database/abstract.repository';
import { StoryNode } from '../entities/story-node.entity';

@Injectable()
export class StoryNodesRepository extends AbstractRepository<StoryNode> {
  protected readonly logger = new Logger(StoryNodesRepository.name);

  constructor(
    @InjectRepository(StoryNode)
    repository: Repository<StoryNode>,
    entityManager: EntityManager,
  ) {
    super(repository, entityManager);
  }
}
