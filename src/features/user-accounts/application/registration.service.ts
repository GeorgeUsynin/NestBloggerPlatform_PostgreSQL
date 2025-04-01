import { Injectable } from '@nestjs/common';
import { add } from 'date-fns/add';
import { EventBus } from '@nestjs/cqrs';
import { randomUUID } from 'node:crypto';
import { UserAccountsConfig } from '../config';
import { PasswordConfirmationCodeCreatedEvent } from './events/PasswordConfirmationCodeCreatedEvent';
import { BadRequestDomainException } from '../../../core/exceptions/domain-exceptions';
import { EmailConfirmationsRepository } from '../infrastructure/emailConfirmations.repository';

@Injectable()
export class RegistrationService {
  constructor(
    private emailConfirmationsRepository: EmailConfirmationsRepository,
    private usersConfig: UserAccountsConfig,
    private eventBus: EventBus,
  ) {}

  async sendEmailConfirmationCode(userId: number, email: string) {
    const usersEmailConfirmation =
      await this.emailConfirmationsRepository.findEmailConfirmationByUserId(
        userId,
      );

    if (usersEmailConfirmation && usersEmailConfirmation.isConfirmed) {
      throw BadRequestDomainException.create(
        'The user has already been confirmed',
        'email',
      );
    }

    const confirmationCode = randomUUID();
    const expirationTimeInHours =
      this.usersConfig.CONFIRMATION_CODE_EXPIRATION_TIME_IN_HOURS;
    const expirationDate = add(new Date(), { hours: expirationTimeInHours });

    const emailConfirmation = this.emailConfirmationsRepository.create({
      userId,
      confirmationCode,
      expirationDate,
      isConfirmed: false,
    });
    await this.emailConfirmationsRepository.save(emailConfirmation);

    this.eventBus.publish(
      new PasswordConfirmationCodeCreatedEvent(email, confirmationCode),
    );
  }
}
