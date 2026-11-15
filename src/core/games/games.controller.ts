import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { GamesService } from './games.service';
import { GameTypeEnum } from './entities/game-question.entity';
import { AgeGroupEnum } from '../../common/enum/age-group.enum';
import { LanguageEnum } from '../../common/enum/languages.enum';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('games')
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Public()
  @Get(':gameType')
  @ApiOperation({
    summary:
      'Get game questions by game category (math, alphabet, quiz, memory, animals)',
  })
  @ApiQuery({ name: 'ageGroup', enum: AgeGroupEnum, required: false })
  @ApiQuery({ name: 'language', enum: LanguageEnum, required: false })
  getQuestions(
    @Param('gameType') gameType: GameTypeEnum,
    @Query('ageGroup') ageGroup?: AgeGroupEnum,
    @Query('language') language?: LanguageEnum,
  ) {
    return this.gamesService.getQuestions(gameType, ageGroup, language);
  }

  @Public()
  @Post(':profileId/submit')
  @ApiOperation({ summary: 'Submit an answer to earn stars' })
  submitAnswer(
    @Param('profileId') profileId: string,
    @Body() body: { questionId: string; answer: string },
  ) {
    return this.gamesService.submitAnswer(
      profileId,
      body.questionId,
      body.answer,
    );
  }
}
