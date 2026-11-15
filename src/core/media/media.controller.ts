import {
    BadRequestException,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Post,
    UploadedFile,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { MediaService } from './media.service';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Users } from '../users/entities/users.entity';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('media')
@Controller('media')
export class MediaController {
    constructor(private readonly mediaService: MediaService) {}

    @ApiBearerAuth('JWT')
    @UseGuards(JwtAuthGuard)
    @Post('upload')
    @UseInterceptors(
        FileInterceptor('file', {
            limits: { fileSize: 30 * 1024 * 1024 }, // 30 MB (for audio stories/SVGs)
        }),
    )
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: { type: 'string', format: 'binary' },
            },
            required: ['file'],
        },
    })
    @ApiOperation({ summary: 'Upload a file (audio track, story illustration, coloring SVG)' })
    upload(
        @UploadedFile() file: Express.Multer.File,
        @CurrentUser() user: Users,
    ) {
        if (!file) {
            throw new BadRequestException('File is required');
        }
        return this.mediaService.uploadFile(file, 'taliko/general', user.id);
    }

    @ApiBearerAuth('JWT')
    @UseGuards(JwtAuthGuard)
    @Post('upload-multiple')
    @UseInterceptors(
        FilesInterceptor('files', 10, {
            limits: { fileSize: 30 * 1024 * 1024 },
        }),
    )
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                files: {
                    type: 'array',
                    items: { type: 'string', format: 'binary' },
                },
            },
            required: ['files'],
        },
    })
    @ApiOperation({ summary: 'Upload multiple files simultaneously' })
    uploadMultiple(
        @UploadedFiles() files: Express.Multer.File[],
        @CurrentUser() user: Users,
    ) {
        if (!files || files.length === 0) {
            throw new BadRequestException('At least one file is required');
        }
        return this.mediaService.uploadMultipleFiles(files, 'taliko/general', user.id);
    }

    @Public()
    @Get()
    @ApiOperation({ summary: 'List all media records' })
    findAll() {
        return this.mediaService.findAllFiles();
    }

    @Public()
    @Get(':id')
    @ApiOperation({ summary: 'Get media record by UUID' })
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.mediaService.findFileById(id);
    }

    @ApiBearerAuth('JWT')
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a media record' })
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.mediaService.deleteFile(id);
    }
}
