import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { AbstractRepository } from '../../../libs/database/abstract.repository';
import { Badge } from '../entities/badge.entity';

@Injectable()
export class BadgesRepository extends AbstractRepository<Badge> {
  protected readonly logger = new Logger(BadgesRepository.name);

  constructor(
    @InjectRepository(Badge)
    repository: Repository<Badge>,
    entityManager: EntityManager,
  ) {
    super(repository, entityManager);
  }
}
