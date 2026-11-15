import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PasswordHashService } from '../../helpers/password_hash/passwordHash.service';

@Injectable()
export class ParentalPinGuard implements CanActivate {
  constructor(private readonly passwordHashService: PasswordHashService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.parentalPinHash) {
      throw new ForbiddenException('Parent account context required');
    }

    const pin =
      (request.headers['x-parental-pin'] as string) ||
      request.body?.pin ||
      request.body?.parentalPin;

    if (!pin) {
      throw new ForbiddenException(
        'Parental PIN required to access this resource (via x-parental-pin header or pin body property)',
      );
    }

    const isValid = await this.passwordHashService.comparePassword(
      String(pin),
      user.parentalPinHash,
    );

    if (!isValid) {
      throw new ForbiddenException('Invalid parental security PIN');
    }

    return true;
  }
}
