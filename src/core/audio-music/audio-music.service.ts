import { Injectable } from '@nestjs/common';
import { MusicTracksRepository } from './repositories/music-tracks.repository';
import { MusicTrack, MusicTypeEnum } from './entities/music-track.entity';
import { LanguageEnum } from '../../common/enum/languages.enum';

@Injectable()
export class AudioMusicService {
  constructor(private readonly tracksRepository: MusicTracksRepository) {}

  async getTracks(filter?: {
    type?: MusicTypeEnum;
    language?: LanguageEnum;
  }): Promise<MusicTrack[]> {
    const where: any = { deleted: false };
    if (filter?.type && Object.values(MusicTypeEnum).includes(filter.type)) {
      where.type = filter.type;
    }
    if (
      filter?.language &&
      Object.values(LanguageEnum).includes(filter.language)
    ) {
      where.language = filter.language;
    }
    return this.tracksRepository.find({ where, order: { createdAt: 'DESC' } });
  }

  async getInstruments(): Promise<MusicTrack[]> {
    return this.tracksRepository.find({
      where: { type: MusicTypeEnum.TRADITIONAL_INSTRUMENT, deleted: false },
    });
  }

  async createTrack(data: Partial<MusicTrack>): Promise<MusicTrack> {
    const track = new MusicTrack(data);
    return this.tracksRepository.create(track);
  }
}
