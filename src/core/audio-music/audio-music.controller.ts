import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AudioMusicService } from './audio-music.service';
import { MusicTypeEnum } from './entities/music-track.entity';
import { LanguageEnum } from '../../common/enum/languages.enum';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('music')
@Controller('music')
export class AudioMusicController {
  constructor(private readonly musicService: AudioMusicService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Browse nursery rhymes, songs and audio tracks' })
  @ApiQuery({ name: 'type', enum: MusicTypeEnum, required: false })
  @ApiQuery({ name: 'language', enum: LanguageEnum, required: false })
  getTracks(
    @Query('type') type?: MusicTypeEnum,
    @Query('language') language?: LanguageEnum,
  ) {
    return this.musicService.getTracks({ type, language });
  }

  @Public()
  @Get('instruments')
  @ApiOperation({
    summary:
      'Discover traditional African instruments (Kora, Balafon, Djembé...)',
  })
  getInstruments() {
    return this.musicService.getInstruments();
  }
}
