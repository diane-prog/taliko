import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { AbstractEntity } from '../../../libs/database/abstract.entity';
import { Story } from './story.entity';
import { StoryChoice } from './story-choice.entity';
import { StoryAudioTrack } from './story-audio-track.entity';

@Entity('story_nodes')
export class StoryNode extends AbstractEntity<StoryNode> {
  @Index()
  @ManyToOne(() => Story, (story) => story.nodes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'storyId' })
  story: Story;

  @Column({ nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  content: string;

  @Column({ nullable: true })
  illustrationUrl: string;

  @Column({ nullable: true, default: 'fade_in' })
  animationType: string;

  @Column({ type: 'boolean', default: false })
  isEndingNode: boolean;

  @Column({ type: 'text', nullable: true })
  moral?: string;

  @OneToMany(() => StoryAudioTrack, (track) => track.node, { cascade: true })
  audioTracks: StoryAudioTrack[];

  @OneToMany(() => StoryChoice, (choice) => choice.node, { cascade: true })
  choices: StoryChoice[];
}
