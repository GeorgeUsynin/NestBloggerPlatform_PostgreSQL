import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailAdapter {
  constructor(private mailerService: MailerService) {}

  sendEmail(email: string, subject: string, message: string) {
    this.mailerService
      .sendMail({
        to: email,
        subject: subject,
        html: message,
      })
      .catch((err) => {
        console.error(err);
        throw new Error('Email adapter send error');
      });
  }
}
