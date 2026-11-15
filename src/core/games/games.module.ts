import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../libs/database/database.module';
import { GameQuestion } from './entities/game-question.entity';
import { GameQuestionsRepository } from './repositories/game-questions.repository';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { ProfilesModule } from '../profiles/profiles.module';

@Module({
  imports: [DatabaseModule.forFeature([GameQuestion]), ProfilesModule],
  controllers: [GamesController],
  providers: [GameQuestionsRepository, GamesService],
  exports: [GamesService, GameQuestionsRepository],
})
export class GamesModule {}
