import { Injectable } from '@nestjs/common';
import { add } from 'date-fns/add';
import { EventBus } from '@nestjs/cqrs';
import { randomUUID } from 'node:crypto';
import { UsersRepository } from '../infrastructure/users.repository';
import { UserDocument } from '../domain/user.entity';
import { UserAccountsConfig } from '../config';
import { PasswordConfirmationCodeCreatedEvent } from './events/PasswordConfirmationCodeCreatedEvent';

@Injectable()
export class RegistrationService {
  constructor(
    private usersRepository: UsersRepository,
    private usersConfig: UserAccountsConfig,
    private eventBus: EventBus,
  ) {}

  async sendEmailConfirmationCode(user: UserDocument) {
    const confirmationCode = randomUUID();
    const expirationTimeInHours =
      this.usersConfig.CONFIRMATION_CODE_EXPIRATION_TIME_IN_HOURS;
    const expirationDate = add(new Date(), { hours: expirationTimeInHours });

    user.setConfirmationCode(confirmationCode, expirationDate);

    await this.usersRepository.save(user);

    this.eventBus.publish(
      new PasswordConfirmationCodeCreatedEvent(user.email, confirmationCode),
    );
  }
}
