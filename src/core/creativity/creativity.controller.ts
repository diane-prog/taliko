import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreativityService } from './creativity.service';
import { AgeGroupEnum } from '../../common/enum/age-group.enum';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('creativity')
@Controller('creativity')
export class CreativityController {
  constructor(private readonly creativityService: CreativityService) {}

  @Public()
  @Get('templates')
  @ApiOperation({
    summary: 'Get interactive coloring templates (animals, masks, village)',
  })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'ageGroup', enum: AgeGroupEnum, required: false })
  getTemplates(
    @Query('category') category?: string,
    @Query('ageGroup') ageGroup?: AgeGroupEnum,
  ) {
    return this.creativityService.getTemplates(category, ageGroup);
  }

  @Public()
  @Post(':profileId/artworks')
  @ApiOperation({ summary: "Save a child's free drawing or colored artwork" })
  saveArtwork(
    @Param('profileId') profileId: string,
    @Body()
    body: { title: string; drawingDataUrl: string; templateId?: string },
  ) {
    return this.creativityService.saveArtwork(profileId, body);
  }

  @Public()
  @Get(':profileId/artworks')
  @ApiOperation({
    summary: 'Get gallery of saved drawings for a child profile',
  })
  getArtworks(@Param('profileId') profileId: string) {
    return this.creativityService.getArtworksForProfile(profileId);
  }
}
