import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { AbstractRepository } from '../../../libs/database/abstract.repository';
import { Story } from '../entities/story.entity';

@Injectable()
export class StoriesRepository extends AbstractRepository<Story> {
  protected readonly logger = new Logger(StoriesRepository.name);

  constructor(
    @InjectRepository(Story)
    repository: Repository<Story>,
    entityManager: EntityManager,
  ) {
    super(repository, entityManager);
  }
}
