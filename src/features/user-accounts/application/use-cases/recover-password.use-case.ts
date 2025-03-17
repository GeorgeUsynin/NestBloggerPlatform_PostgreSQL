import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'node:crypto';
import { add } from 'date-fns/add';
import { UsersRepository } from '../../infrastructure/users.repository';
import { PasswordRecoveryCodeCreatedEvent } from '../events/PasswordRecoveryCodeCreatedEvent';
import { UserAccountsConfig } from '../../config';

export class RecoverPasswordCommand {
  constructor(public readonly email: string) {}
}

@CommandHandler(RecoverPasswordCommand)
export class RecoverPasswordUseCase
  implements ICommandHandler<RecoverPasswordCommand, void>
{
  constructor(
    private usersRepository: UsersRepository,
    private eventBus: EventBus,
    private usersConfig: UserAccountsConfig,
  ) {}

  async execute({ email }: RecoverPasswordCommand) {
    const user = await this.usersRepository.findUserByEmailSQL(email);

    if (!user) return;

    const passwordRecoveryCode = randomUUID();
    const expirationTimeInHours =
      this.usersConfig.RECOVERY_CODE_EXPIRATION_TIME_IN_HOURS;
    const expirationDate = add(new Date(), { hours: expirationTimeInHours });

    await this.usersRepository.updatePasswordRecoverySQL(
      user.id,
      passwordRecoveryCode,
      expirationDate,
    );

    // sent recovery email
    this.eventBus.publish(
      new PasswordRecoveryCodeCreatedEvent(user.email, passwordRecoveryCode),
    );
  }
}
