import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';
import { MediaRepository } from './repositories/media.repository';
import { Media } from './entities/media.entity';
import { ErrorHandlingService } from '../../common/response/errorHandler.service';

interface CloudinaryUploadResult {
    publicId: string;
    url: string;
    secureUrl: string;
    format: string;
    bytes: number;
    folder: string;
    resourceType: string;
}

@Injectable()
export class MediaService {
    private configured = false;

    constructor(
        private readonly configService: ConfigService,
        private readonly mediaRepository: MediaRepository,
        private readonly errorHandler: ErrorHandlingService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    ) {
        this.configure();
    }

    private configure(): void {
        const cloudName =
            this.configService.get<string>('storage.cloudName') ||
            this.configService.get<string>('CLOUDINARY_CLOUD_NAME');
        const apiKey =
            this.configService.get<string>('storage.apiKey') ||
            this.configService.get<string>('CLOUDINARY_API_KEY');
        const apiSecret =
            this.configService.get<string>('storage.apiSecret') ||
            this.configService.get<string>('CLOUDINARY_API_SECRET');

        if (cloudName && apiKey && apiSecret) {
            cloudinary.config({
                cloud_name: cloudName,
                api_key: apiKey,
                api_secret: apiSecret,
                secure: true,
            });
            this.configured = true;
            this.logger.info('[Media] Cloudinary configured successfully.');
            return;
        }

        this.logger.warn(
            '[Media] Cloudinary is not configured. Uploads will fallback to mock URLs until CLOUDINARY_* variables are set.',
        );
    }

    isConfigured(): boolean {
        return this.configured;
    }

    async uploadFile(
        file: Express.Multer.File,
        folder = 'taliko/general',
        uploaderId?: string,
    ): Promise<Media> {
        if (!file?.buffer || !file.originalname) {
            throw new BadRequestException('File is required');
        }

        const upload = await this.uploadToCloudinary(file, folder);

        const media = new Media({
            publicId: upload.publicId,
            url: upload.secureUrl,
            originalName: file.originalname,
            mimeType: file.mimetype,
            format: upload.format,
            folder: upload.folder,
            sizeBytes: upload.bytes,
            resourceType: upload.resourceType,
            uploaderId,
        });

        const saved = await this.mediaRepository.create(media);
        this.logger.info(`[Media] Uploaded asset: ${saved.publicId}`);
        return saved;
    }

    async uploadMultipleFiles(
        files: Express.Multer.File[],
        folder = 'taliko/general',
        uploaderId?: string,
    ): Promise<Media[]> {
        if (!files || files.length === 0) {
            throw new BadRequestException('At least one file is required');
        }

        const results: Media[] = [];
        for (const file of files) {
            results.push(await this.uploadFile(file, folder, uploaderId));
        }
        return results;
    }

    private uploadToCloudinary(
        file: Express.Multer.File,
        folder: string,
    ): Promise<CloudinaryUploadResult> {
        if (!this.configured) {
            const safeName = file.originalname.replace(/[^\w.-]/g, '_');
            const mockId = `${folder}/${Date.now()}_${safeName}`;
            const mockUrl = `https://cdn.taliko.app/${mockId}`;

            return Promise.resolve({
                publicId: mockId,
                url: mockUrl,
                secureUrl: mockUrl,
                format: file.mimetype.split('/')[1] ?? 'bin',
                bytes: file.size,
                folder,
                resourceType: file.mimetype.startsWith('audio/') ? 'audio' : 'image',
            });
        }

        return new Promise<CloudinaryUploadResult>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder,
                    resource_type: 'auto',
                    unique_filename: true,
                },
                (error, result: UploadApiResponse | undefined) => {
                    if (error || !result) {
                        this.logger.error(
                            `Cloudinary upload error: ${error?.message ?? 'unknown error'}`,
                        );
                        reject(
                            new BadRequestException(
                                `Upload failed: ${error?.message ?? 'unknown error'}`,
                            ),
                        );
                        return;
                    }

                    resolve({
                        publicId: result.public_id,
                        url: result.url,
                        secureUrl: result.secure_url,
                        format: result.format,
                        bytes: result.bytes,
                        folder: result.folder || folder,
                        resourceType: result.resource_type,
                    });
                },
            );

            streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
    }

    async findAllFiles(): Promise<Media[]> {
        return this.mediaRepository.find({
            where: { deleted: false },
            order: { createdAt: 'DESC' },
        });
    }

    async findFileById(id: string): Promise<Media> {
        const media = await this.mediaRepository.findOne({
            where: { id, deleted: false },
        });

        if (!media) {
            this.errorHandler.returnErrorOnNotFound(
                `Media ${id} not found`,
                'Media not found',
            );
        }

        return media!;
    }

    async deleteFile(id: string): Promise<{ message: string }> {
        const media = await this.findFileById(id);

        if (this.configured) {
            await cloudinary.uploader.destroy(media.publicId).catch((err) => {
                this.logger.warn(`Cloudinary destroy skipped/failed: ${err}`);
            });
        }

        await this.mediaRepository.softDelete({ id });
        return { message: `Media ${id} deleted successfully` };
    }
}
