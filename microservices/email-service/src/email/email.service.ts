import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(to: string, subject: string, text: string, html?: string) {
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        text,
        html,
      });
    } catch (error) {
      console.error(`Failed to send email to ${to}`, error);
      throw error;
    }
  }
}
