import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { AbstractRepository } from '../../../libs/database/abstract.repository';
import { KidArtwork } from '../entities/kid-artwork.entity';

@Injectable()
export class KidArtworksRepository extends AbstractRepository<KidArtwork> {
  protected readonly logger = new Logger(KidArtworksRepository.name);

  constructor(
    @InjectRepository(KidArtwork)
    repository: Repository<KidArtwork>,
    entityManager: EntityManager,
  ) {
    super(repository, entityManager);
  }
}
