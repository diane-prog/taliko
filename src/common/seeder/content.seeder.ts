import { Injectable, Logger } from '@nestjs/common';
import { StoriesService } from '../../core/stories/stories.service';
import { GamesService } from '../../core/games/games.service';
import { CreativityService } from '../../core/creativity/creativity.service';
import { AudioMusicService } from '../../core/audio-music/audio-music.service';
import { AgeGroupEnum } from '../enum/age-group.enum';
import { LanguageEnum } from '../enum/languages.enum';
import { GameTypeEnum } from '../../core/games/entities/game-question.entity';
import { MusicTypeEnum } from '../../core/audio-music/entities/music-track.entity';
import { StoryChoice } from '../../core/stories/entities/story-choice.entity';
import { StoryAudioTrack } from '../../core/stories/entities/story-audio-track.entity';

@Injectable()
export class ContentSeeder {
  private readonly logger = new Logger(ContentSeeder.name);

  constructor(
    private readonly storiesService: StoriesService,
    private readonly gamesService: GamesService,
    private readonly creativityService: CreativityService,
    private readonly musicService: AudioMusicService,
  ) {}

  async seed(): Promise<void> {
    await this.seedStory();
    await this.seedGames();
    await this.seedInstrumentsAndMusic();
    await this.seedColoring();
  }

  private async seedStory(): Promise<void> {
    const existingStories = await this.storiesService.findAll();
    if (existingStories.length > 0) {
      return;
    }

    const story = await this.storiesService.create({
      title: "La ruse d'Anansi et le vieux baobab",
      summary:
        'Découvre comment la célèbre araignée Anansi a appris le partage grâce aux animaux de la forêt sacrée.',
      cultureRegion: 'Afrique de l’Ouest (Ashanti / Golfe de Guinée)',
      ageGroup: AgeGroupEnum.EARLY_5_7,
      isPremium: false,
      availableLanguages: [
        LanguageEnum.FRENCH,
        LanguageEnum.FON,
        LanguageEnum.YORUBA,
        LanguageEnum.ENGLISH,
      ],
      coverImage:
        'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800',
    });

    // Scene 1: Arrival at the sacred river
    const node1 = await this.storiesService.createNode(story.id, {
      title: 'Le carrefour de la savane',
      content:
        "Il était une fois, Anansi l'araignée marchait sous un soleil éclatant. Devant lui se dressent deux chemins : l'un traverse la rivière chantante, l'autre contourne le grand rocher rouge.",
      illustrationUrl:
        'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800',
      animationType: 'pan_right',
      isEndingNode: false,
      audioTracks: [
        new StoryAudioTrack({
          language: LanguageEnum.FRENCH,
          audioUrl: 'https://cdn.taliko.app/audio/fr/anansi_scene1.mp3',
          durationSeconds: 45,
        }),
        new StoryAudioTrack({
          language: LanguageEnum.FON,
          audioUrl: 'https://cdn.taliko.app/audio/fon/anansi_scene1.mp3',
          durationSeconds: 50,
        }),
        new StoryAudioTrack({
          language: LanguageEnum.YORUBA,
          audioUrl: 'https://cdn.taliko.app/audio/yoruba/anansi_scene1.mp3',
          durationSeconds: 48,
        }),
      ],
      choices: [],
    });

    // Scene 2A: The friendly monkey by the river
    const node2 = await this.storiesService.createNode(story.id, {
      title: 'La rencontre avec le sage singe',
      content:
        "En s'approchant de la rivière, Anansi aperçoit Coco le singe qui lui offre un délicieux régime de bananes. Anansi remercie son ami et comprend la valeur de la générosité.",
      illustrationUrl:
        'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=800',
      isEndingNode: true,
      moral:
        'La générosité et le sourire ouvrent toujours les cœurs les plus fermés.',
      audioTracks: [
        new StoryAudioTrack({
          language: LanguageEnum.FRENCH,
          audioUrl: 'https://cdn.taliko.app/audio/fr/anansi_scene2.mp3',
          durationSeconds: 40,
        }),
      ],
      choices: [],
    });

    node1.choices = [
      new StoryChoice({
        label: 'Traverser vers la rivière enchantée',
        nextNodeId: node2.id,
      }),
    ];

    this.logger.log("Seeded interactive African story: La ruse d'Anansi");
  }

  private async seedGames(): Promise<void> {
    const questions = await this.gamesService.getQuestions(GameTypeEnum.QUIZ);
    if (questions.length > 0) {
      return;
    }

    // Quiz Question: African Wildlife
    await this.gamesService.createQuestion({
      gameType: GameTypeEnum.ANIMALS_NATURE,
      ageGroup: AgeGroupEnum.EARLY_5_7,
      language: LanguageEnum.FRENCH,
      prompt: "Quel est l'animal le plus rapide de la savane africaine ?",
      options: ['Le Guépard', 'La Tortue', 'L’Éléphant', 'Le Zèbre'],
      correctAnswer: 'Le Guépard',
      explanation: 'Le guépard peut courir à plus de 100 km/h dans la savane !',
      starsReward: 15,
    });

    // Math Question with local fruits
    await this.gamesService.createQuestion({
      gameType: GameTypeEnum.MATH,
      ageGroup: AgeGroupEnum.EARLY_5_7,
      language: LanguageEnum.FRENCH,
      prompt:
        'Kofi a 3 mangues bien mûres. Sa sœur Fanta lui en donne 2 de plus. Combien de mangues a Kofi maintenant ?',
      options: ['3', '4', '5', '6'],
      correctAnswer: '5',
      explanation: '3 + 2 = 5 délicieuses mangues ! Bravo !',
      starsReward: 10,
    });

    // Alphabet Question
    await this.gamesService.createQuestion({
      gameType: GameTypeEnum.ALPHABET,
      ageGroup: AgeGroupEnum.TODDLER_2_4,
      language: LanguageEnum.FRENCH,
      prompt: "Quelle lettre commence le mot 'Baobab' ?",
      options: ['A', 'B', 'M', 'K'],
      correctAnswer: 'B',
      explanation: "B comme Baobab, l'arbre majestueux !",
      starsReward: 10,
    });

    this.logger.log('Seeded educational questions (Math, Alphabet, Wildlife)');
  }

  private async seedInstrumentsAndMusic(): Promise<void> {
    const instruments = await this.musicService.getInstruments();
    if (instruments.length > 0) {
      return;
    }

    await this.musicService.createTrack({
      title: 'La Kora magique des Griots',
      type: MusicTypeEnum.TRADITIONAL_INSTRUMENT,
      language: LanguageEnum.FRENCH,
      instrumentName: 'Kora',
      audioUrl: 'https://cdn.taliko.app/music/instruments/kora_solo.mp3',
      description:
        'La kora est une harpe-luth d’Afrique de l’Ouest avec 21 cordes fabriquée avec une demi-calebasse.',
      durationSeconds: 120,
    });

    await this.musicService.createTrack({
      title: 'Le rythme du Djembé festif',
      type: MusicTypeEnum.TRADITIONAL_INSTRUMENT,
      language: LanguageEnum.FRENCH,
      instrumentName: 'Djembé',
      audioUrl: 'https://cdn.taliko.app/music/instruments/djembe_solo.mp3',
      description:
        'Le djembé est un tambour en bois recouvert d’une peau de chèvre, parfait pour danser et chanter en chœur.',
      durationSeconds: 95,
    });

    this.logger.log('Seeded traditional instruments (Kora, Djembé)');
  }

  private async seedColoring(): Promise<void> {
    const templates = await this.creativityService.getTemplates();
    if (templates.length > 0) {
      return;
    }

    await this.creativityService.createTemplate({
      title: 'La petite Gazelle de la Savane',
      category: 'animals',
      ageGroup: AgeGroupEnum.EARLY_5_7,
      svgContent:
        '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" stroke="#000" stroke-width="3" fill="#fff" /></svg>',
      previewImageUrl: 'https://cdn.taliko.app/coloring/gazelle_preview.png',
    });

    this.logger.log('Seeded coloring templates');
  }
}
