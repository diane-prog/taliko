import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../libs/database/database.module';
import { MusicTrack } from './entities/music-track.entity';
import { MusicTracksRepository } from './repositories/music-tracks.repository';
import { AudioMusicService } from './audio-music.service';
import { AudioMusicController } from './audio-music.controller';

@Module({
  imports: [DatabaseModule.forFeature([MusicTrack])],
  controllers: [AudioMusicController],
  providers: [MusicTracksRepository, AudioMusicService],
  exports: [AudioMusicService],
})
export class AudioMusicModule {}
