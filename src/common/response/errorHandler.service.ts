import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class ErrorHandlingService {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) readonly logger: Logger) {}

  returnErrorOnNotFound(loggerMessage: string, errorMessage: string): never {
    this.logger.error(loggerMessage);
    throw new NotFoundException(errorMessage);
  }

  returnErrorOnBadRequest(loggerMessage: string, errorMessage: string): never {
    this.logger.error(loggerMessage);
    throw new BadRequestException(errorMessage);
  }

  returnErrorOnConflict(loggerMessage: string, errorMessage: string): never {
    this.logger.error(loggerMessage);
    throw new ConflictException(errorMessage);
  }

  returnErrorOnUnauthorized(
    loggerMessage: string,
    errorMessage: string,
  ): never {
    this.logger.error(loggerMessage);
    throw new UnauthorizedException(errorMessage);
  }

  returnErrorOnForbidden(loggerMessage: string, errorMessage: string): never {
    this.logger.error(loggerMessage);
    throw new ForbiddenException(errorMessage);
  }

  returnErrorOnInternal(loggerMessage: string, errorMessage: string): never {
    this.logger.error(loggerMessage);
    throw new InternalServerErrorException(errorMessage);
  }
}
