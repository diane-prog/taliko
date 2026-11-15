import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { AbstractRepository } from '../../../libs/database/abstract.repository';
import { EarnedBadge } from '../entities/earned-badge.entity';

@Injectable()
export class EarnedBadgesRepository extends AbstractRepository<EarnedBadge> {
  protected readonly logger = new Logger(EarnedBadgesRepository.name);

  constructor(
    @InjectRepository(EarnedBadge)
    repository: Repository<EarnedBadge>,
    entityManager: EntityManager,
  ) {
    super(repository, entityManager);
  }
}
