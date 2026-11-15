import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../../libs/database/abstract.entity';
import { Users } from '../../users/entities/users.entity';

export enum SubscriptionPlanEnum {
  FREE = 'free',
  FAMILY_MONTHLY = 'family_monthly',
  FAMILY_YEARLY = 'family_yearly',
  SCHOOL_LICENSE = 'school_license',
}

export enum SubscriptionStatusEnum {
  PENDING = 'pending',
  ACTIVE = 'active',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

export enum PaymentMethodEnum {
  MOBILE_MONEY_MTN = 'momo_mtn',
  MOBILE_MONEY_MOOV = 'momo_moov',
  ORANGE_MONEY = 'orange_money',
  WAVE = 'wave',
  CREDIT_CARD = 'card',
}

@Entity('subscriptions')
export class Subscription extends AbstractEntity<Subscription> {
  @Index()
  @ManyToOne(() => Users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: Users;

  @Column({
    type: 'enum',
    enum: SubscriptionPlanEnum,
    default: SubscriptionPlanEnum.FAMILY_MONTHLY,
  })
  plan: SubscriptionPlanEnum;

  @Column({
    type: 'enum',
    enum: SubscriptionStatusEnum,
    default: SubscriptionStatusEnum.PENDING,
  })
  status: SubscriptionStatusEnum;

  @Column({
    type: 'enum',
    enum: PaymentMethodEnum,
    default: PaymentMethodEnum.MOBILE_MONEY_MTN,
  })
  paymentMethod: PaymentMethodEnum;

  @Column({ type: 'int', default: 2500 }) // FCFA
  amountXof: number;

  @Column({ type: 'timestamp', nullable: true })
  startDate?: Date;

  @Column({ type: 'timestamp', nullable: true })
  endDate?: Date;

  @Column({ nullable: true })
  transactionReference?: string;
}
