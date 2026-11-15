import {
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { AbstractEntity } from '../../../libs/database/abstract.entity';
import { ChildProfile } from '../../profiles/entities/child-profile.entity';
import { Badge } from './badge.entity';

@Entity('earned_badges')
export class EarnedBadge extends AbstractEntity<EarnedBadge> {
  @Index()
  @ManyToOne(() => ChildProfile, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'profileId' })
  profile: ChildProfile;

  @ManyToOne(() => Badge, (badge) => badge.earnedBadges, {
    eager: true,
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'badgeId' })
  badge: Badge;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  earnedAt: Date;
}
