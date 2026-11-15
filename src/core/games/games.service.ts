import { Injectable } from '@nestjs/common';
import { GameQuestionsRepository } from './repositories/game-questions.repository';
import { ProfilesService } from '../profiles/profiles.service';
import { GameQuestion, GameTypeEnum } from './entities/game-question.entity';
import { AgeGroupEnum } from '../../common/enum/age-group.enum';
import { LanguageEnum } from '../../common/enum/languages.enum';
import { ErrorHandlingService } from '../../common/response/errorHandler.service';

@Injectable()
export class GamesService {
  constructor(
    private readonly questionsRepository: GameQuestionsRepository,
    private readonly profilesService: ProfilesService,
    private readonly errorHandler: ErrorHandlingService,
  ) {}

  async getQuestions(
    gameType: GameTypeEnum,
    ageGroup?: AgeGroupEnum,
    language?: LanguageEnum,
  ): Promise<GameQuestion[]> {
    const where: any = { gameType, deleted: false };
    if (ageGroup && Object.values(AgeGroupEnum).includes(ageGroup)) {
      where.ageGroup = ageGroup;
    }
    if (language && Object.values(LanguageEnum).includes(language)) {
      where.language = language;
    }

    return this.questionsRepository.find({
      where,
      take: 20,
    });
  }

  async submitAnswer(
    profileId: string,
    questionId: string,
    answer: string,
  ): Promise<{
    isCorrect: boolean;
    correctAnswer: string;
    explanation?: string;
    starsEarned: number;
  }> {
    const question = await this.questionsRepository.findOne({
      where: { id: questionId, deleted: false },
    });

    if (!question) {
      this.errorHandler.returnErrorOnNotFound(
        `Question ${questionId} not found`,
        'Game question not found',
      );
    }

    const isCorrect =
      question!.correctAnswer.trim().toLowerCase() ===
      answer.trim().toLowerCase();

    let starsEarned = 0;
    if (isCorrect) {
      starsEarned = question!.starsReward || 10;
      await this.profilesService.addStars(profileId, starsEarned);
    }

    return {
      isCorrect,
      correctAnswer: question!.correctAnswer,
      explanation: question!.explanation,
      starsEarned,
    };
  }

  async createQuestion(data: Partial<GameQuestion>): Promise<GameQuestion> {
    const question = new GameQuestion(data);
    return this.questionsRepository.create(question);
  }
}
