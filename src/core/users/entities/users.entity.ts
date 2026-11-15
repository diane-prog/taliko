import { Exclude } from 'class-transformer';
import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
} from 'typeorm';
import { AbstractEntity } from '../../../libs/database/abstract.entity';
import { Roles } from '../../roles/entities/roles.entity';
import { ChildProfile } from '../../profiles/entities/child-profile.entity';
import { LanguageEnum } from '../../../common/enum/languages.enum';

@Entity('users')
export class Users extends AbstractEntity<Users> {
    @Column({ nullable: false })
    fullname: string;

    @Index()
    @Column({ unique: true, nullable: false })
    email: string;

    @Column({ nullable: true })
    phone?: string;

    @Exclude()
    @Column({ nullable: false })
    passwordHash: string;

    @Exclude()
    @Column({ nullable: false })
    parentalPinHash: string;

    @ManyToOne(() => Roles, (role) => role.users, {
        eager: true,
        nullable: false,
    })
    @JoinColumn({ name: 'roleId' })
    role: Roles;

    @Column({ default: 'free' })
    plan: string;

    @Column({ type: 'timestamp', nullable: true })
    premiumUntil?: Date;

    @Column({ type: 'int', default: 4 })
    childrenLimit: number;

    @Column({
        type: 'enum',
        enum: LanguageEnum,
        default: LanguageEnum.FRENCH,
    })
    preferredLanguage: LanguageEnum;

    @Column({ type: 'boolean', default: false })
    emailVerified: boolean;

    @OneToMany(() => ChildProfile, (child) => child.parent, {
        cascade: true,
    })
    children: ChildProfile[];

    @Column({ type: 'timestamp', nullable: true })
    lastLoginAt?: Date;
}
