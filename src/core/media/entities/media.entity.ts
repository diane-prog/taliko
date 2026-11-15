import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../../../libs/database/abstract.entity';

@Entity('media')
export class Media extends AbstractEntity<Media> {
    @Column({ nullable: false })
    url: string;

    @Column({ nullable: false })
    publicId: string;

    @Column({ nullable: false })
    originalName: string;

    @Column({ nullable: false })
    mimeType: string;

    @Column({ nullable: true })
    format?: string;

    @Column({ nullable: true, default: 'taliko/general' })
    folder: string;

    @Column({ type: 'int', default: 0 })
    sizeBytes: number;

    @Column({ default: 'auto' })
    resourceType: string;

    @Column({ nullable: true })
    uploaderId?: string;
}
