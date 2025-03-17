import { Injectable } from '@nestjs/common';
import { add } from 'date-fns/add';
import { EventBus } from '@nestjs/cqrs';
import { randomUUID } from 'node:crypto';
import { UsersRepository } from '../infrastructure/users.repository';
import { UserAccountsConfig } from '../config';
import { PasswordConfirmationCodeCreatedEvent } from './events/PasswordConfirmationCodeCreatedEvent';
import { DBUser } from '../infrastructure/types';
import { BadRequestDomainException } from '../../../core/exceptions/domain-exceptions';

@Injectable()
export class RegistrationService {
  constructor(
    private usersRepository: UsersRepository,
    private usersConfig: UserAccountsConfig,
    private eventBus: EventBus,
  ) {}

  async sendEmailConfirmationCode(user: DBUser) {
    const usersEmailConfirmation =
      await this.usersRepository.findEmailConfirmationByUserId(user.id);

    if (usersEmailConfirmation.isConfirmed) {
      throw BadRequestDomainException.create(
        'The user has already been confirmed',
        'email',
      );
    }

    const confirmationCode = randomUUID();
    const expirationTimeInHours =
      this.usersConfig.CONFIRMATION_CODE_EXPIRATION_TIME_IN_HOURS;
    const expirationDate = add(new Date(), { hours: expirationTimeInHours });

    await this.usersRepository.updateEmailConfirmationSQL(
      user.id,
      confirmationCode,
      expirationDate,
    );

    this.eventBus.publish(
      new PasswordConfirmationCodeCreatedEvent(user.email, confirmationCode),
    );
  }
}
