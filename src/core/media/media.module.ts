import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../libs/database/database.module';
import { Media } from './entities/media.entity';
import { MediaRepository } from './repositories/media.repository';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';

@Module({
  imports: [DatabaseModule.forFeature([Media])],
  controllers: [MediaController],
  providers: [MediaRepository, MediaService],
  exports: [MediaService, MediaRepository],
})
export class MediaModule {}
