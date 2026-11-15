import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { AbstractRepository } from '../../../libs/database/abstract.repository';
import { MusicTrack } from '../entities/music-track.entity';

@Injectable()
export class MusicTracksRepository extends AbstractRepository<MusicTrack> {
  protected readonly logger = new Logger(MusicTracksRepository.name);

  constructor(
    @InjectRepository(MusicTrack)
    repository: Repository<MusicTrack>,
    entityManager: EntityManager,
  ) {
    super(repository, entityManager);
  }
}
