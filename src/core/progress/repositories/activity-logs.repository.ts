import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { AbstractRepository } from '../../../libs/database/abstract.repository';
import { ActivityLog } from '../entities/activity-log.entity';

@Injectable()
export class ActivityLogsRepository extends AbstractRepository<ActivityLog> {
  protected readonly logger = new Logger(ActivityLogsRepository.name);

  constructor(
    @InjectRepository(ActivityLog)
    repository: Repository<ActivityLog>,
    entityManager: EntityManager,
  ) {
    super(repository, entityManager);
  }
}
