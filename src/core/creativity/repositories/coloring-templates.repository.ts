import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { AbstractRepository } from '../../../libs/database/abstract.repository';
import { ColoringTemplate } from '../entities/coloring-template.entity';

@Injectable()
export class ColoringTemplatesRepository extends AbstractRepository<ColoringTemplate> {
  protected readonly logger = new Logger(ColoringTemplatesRepository.name);

  constructor(
    @InjectRepository(ColoringTemplate)
    repository: Repository<ColoringTemplate>,
    entityManager: EntityManager,
  ) {
    super(repository, entityManager);
  }
}
