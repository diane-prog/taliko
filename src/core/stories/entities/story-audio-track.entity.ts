import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../../libs/database/abstract.entity';
import { StoryNode } from './story-node.entity';
import { LanguageEnum } from '../../../common/enum/languages.enum';

@Entity('story_audio_tracks')
export class StoryAudioTrack extends AbstractEntity<StoryAudioTrack> {
  @Index()
  @ManyToOne(() => StoryNode, (node) => node.audioTracks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'nodeId' })
  node: StoryNode;

  @Column({
    type: 'enum',
    enum: LanguageEnum,
    default: LanguageEnum.FRENCH,
  })
  language: LanguageEnum;

  @Column({ nullable: false })
  audioUrl: string;

  @Column({ type: 'int', default: 0 })
  durationSeconds: number;
}
