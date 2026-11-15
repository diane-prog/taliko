import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { AbstractRepository } from '../../../libs/database/abstract.repository';
import { GameQuestion } from '../entities/game-question.entity';

@Injectable()
export class GameQuestionsRepository extends AbstractRepository<GameQuestion> {
  protected readonly logger = new Logger(GameQuestionsRepository.name);

  constructor(
    @InjectRepository(GameQuestion)
    repository: Repository<GameQuestion>,
    entityManager: EntityManager,
  ) {
    super(repository, entityManager);
  }
}
