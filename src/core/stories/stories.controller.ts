import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { StoriesService } from './stories.service';
import { Public } from '../../common/decorators/public.decorator';
import { AgeGroupEnum } from '../../common/enum/age-group.enum';
import { LanguageEnum } from '../../common/enum/languages.enum';

@ApiTags('stories')
@Controller('stories')
export class StoriesController {
  constructor(private readonly storiesService: StoriesService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Browse stories with optional age & language filtering',
  })
  @ApiQuery({ name: 'ageGroup', enum: AgeGroupEnum, required: false })
  @ApiQuery({ name: 'language', enum: LanguageEnum, required: false })
  findAll(
    @Query('ageGroup') ageGroup?: AgeGroupEnum,
    @Query('language') language?: LanguageEnum,
  ) {
    return this.storiesService.findAll({ ageGroup, language });
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get story overview and metadata' })
  findOne(@Param('id') id: string) {
    return this.storiesService.findById(id);
  }

  @Public()
  @Get(':storyId/nodes/:nodeId')
  @ApiOperation({
    summary:
      'Get a specific story scene node with choices and matching language audio track',
  })
  @ApiQuery({ name: 'lang', enum: LanguageEnum, required: false })
  getNode(
    @Param('storyId') storyId: string,
    @Param('nodeId') nodeId: string,
    @Query('lang') lang?: LanguageEnum,
  ) {
    return this.storiesService.getNode(storyId, nodeId, lang);
  }
}
