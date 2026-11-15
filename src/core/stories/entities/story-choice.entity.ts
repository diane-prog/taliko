import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../../libs/database/abstract.entity';
import { StoryNode } from './story-node.entity';

@Entity('story_choices')
export class StoryChoice extends AbstractEntity<StoryChoice> {
  @Index()
  @ManyToOne(() => StoryNode, (node) => node.choices, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'nodeId' })
  node: StoryNode;

  @Column({ nullable: false })
  label: string;

  @Column({ nullable: true })
  audioUrl?: string;

  @Column({ nullable: false })
  nextNodeId: string;
}
