import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { AbstractRepository } from '../../../libs/database/abstract.repository';
import { Subscription } from '../entities/subscription.entity';

@Injectable()
export class SubscriptionsRepository extends AbstractRepository<Subscription> {
  protected readonly logger = new Logger(SubscriptionsRepository.name);

  constructor(
    @InjectRepository(Subscription)
    repository: Repository<Subscription>,
    entityManager: EntityManager,
  ) {
    super(repository, entityManager);
  }
}
