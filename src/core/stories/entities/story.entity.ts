import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../../libs/database/abstract.entity';
import { AgeGroupEnum } from '../../../common/enum/age-group.enum';
import { LanguageEnum } from '../../../common/enum/languages.enum';
import { StoryNode } from './story-node.entity';

@Entity('stories')
export class Story extends AbstractEntity<Story> {
  @Column({ nullable: false })
  title: string;

  @Column({ type: 'text', nullable: true })
  summary: string;

  @Column({ nullable: true })
  coverImage: string;

  @Column({ nullable: true })
  cultureRegion: string;

  @Column({
    type: 'enum',
    enum: AgeGroupEnum,
    default: AgeGroupEnum.EARLY_5_7,
  })
  ageGroup: AgeGroupEnum;

  @Column({ type: 'boolean', default: false })
  isPremium: boolean;

  @Column({ type: 'simple-array', nullable: false })
  availableLanguages: LanguageEnum[];

  @Column({ nullable: true })
  rootNodeId?: string;

  @OneToMany(() => StoryNode, (node) => node.story, { cascade: true })
  nodes: StoryNode[];
}
