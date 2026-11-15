import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { AbstractRepository } from '../../../libs/database/abstract.repository';
import { ChildProfile } from '../entities/child-profile.entity';

@Injectable()
export class ChildProfilesRepository extends AbstractRepository<ChildProfile> {
  protected readonly logger = new Logger(ChildProfilesRepository.name);

  constructor(
    @InjectRepository(ChildProfile)
    childProfilesRepository: Repository<ChildProfile>,
    entityManager: EntityManager,
  ) {
    super(childProfilesRepository, entityManager);
  }
}
