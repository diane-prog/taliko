import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private readonly transporter: nodemailer.Transporter | null = null;
  private readonly from: string;

  constructor(
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    const host = this.configService.get<string>('mail.host');
    this.from =
      this.configService.get<string>('mail.from') ?? 'no-reply@taliko.app';

    if (host) {
      this.transporter = nodemailer.createTransport({
        host,
        port: this.configService.get<number>('mail.port'),
        secure: this.configService.get<boolean>('mail.secure'),
        auth: {
          user: this.configService.get<string>('mail.user'),
          pass: this.configService.get<string>('mail.password'),
        },
      });
    }
  }

  /**
   * Sends an email if SMTP is configured, otherwise logs a warning without throwing.
   */
  async sendMail(to: string, subject: string, html: string): Promise<unknown> {
    if (!this.transporter) {
      this.logger.warn(
        `SMTP is not configured. Email to ${to} was skipped (Subject: ${subject}).`,
      );
      return { skipped: true };
    }

    try {
      return await this.transporter.sendMail({
        from: this.from,
        to,
        subject,
        html,
      });
    } catch (error) {
      this.logger.error(
        `Failed to send email to ${to}: ${error instanceof Error ? error.message : error}`,
      );
      return { error: true };
    }
  }
}
