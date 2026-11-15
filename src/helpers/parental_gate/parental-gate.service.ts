import { Injectable } from '@nestjs/common';
import { RedisService } from '../../libs/redis/redis.service';
import { v4 as uuidv4 } from 'uuid';

export interface ParentalMathChallenge {
  challengeId: string;
  question: string;
  expiresInSeconds: number;
}

@Injectable()
export class ParentalGateService {
  constructor(private readonly redisService: RedisService) {}

  /**
   * Generates an arithmetic challenge that an adult can solve instantly but prevents small children from exiting.
   */
  async generateChallenge(): Promise<ParentalMathChallenge> {
    const operations = ['+', 'x'];
    const op = operations[Math.floor(Math.random() * operations.length)];
    let num1: number;
    let num2: number;
    let answer: number;

    if (op === 'x') {
      num1 = Math.floor(Math.random() * 8) + 3; // 3 to 10
      num2 = Math.floor(Math.random() * 8) + 3; // 3 to 10
      answer = num1 * num2;
    } else {
      num1 = Math.floor(Math.random() * 40) + 15; // 15 to 54
      num2 = Math.floor(Math.random() * 40) + 15; // 15 to 54
      answer = num1 + num2;
    }

    const challengeId = uuidv4();
    // Store answer with 120s expiration
    await this.redisService.set(
      `parental_challenge:${challengeId}`,
      String(answer),
      120,
    );

    return {
      challengeId,
      question: `Combien font ${num1} ${op} ${num2} ?`,
      expiresInSeconds: 120,
    };
  }

  /**
   * Verifies the answer to a parental math challenge.
   */
  async verifyChallenge(challengeId: string, answer: number): Promise<boolean> {
    const key = `parental_challenge:${challengeId}`;
    const storedAnswer = await this.redisService.get(key);

    if (!storedAnswer) {
      return false;
    }

    const isValid = Number.parseInt(storedAnswer, 10) === Number(answer);
    if (isValid) {
      await this.redisService.del(key);
    }

    return isValid;
  }
}
