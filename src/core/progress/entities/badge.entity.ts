import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../../libs/database/abstract.entity';
import { EarnedBadge } from './earned-badge.entity';
import { ActivityTypeEnum } from './activity-log.entity';

@Entity('badges')
export class Badge extends AbstractEntity<Badge> {
  @Column({ unique: true, nullable: false })
  slug: string;

  @Column({ nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ default: 'badge-default' })
  icon: string;

  @Column({
    type: 'enum',
    enum: ActivityTypeEnum,
    default: ActivityTypeEnum.STORY,
  })
  activityType: ActivityTypeEnum;

  @Column({ type: 'int', default: 1 })
  requiredCount: number;

  @OneToMany(() => EarnedBadge, (eb) => eb.badge)
  earnedBadges: EarnedBadge[];
}
