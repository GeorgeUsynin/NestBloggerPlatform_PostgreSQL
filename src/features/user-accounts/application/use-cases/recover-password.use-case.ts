import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'node:crypto';
import { add } from 'date-fns/add';
import { UsersRepository } from '../../infrastructure/users.repository';
import { PasswordRecoveryCodeCreatedEvent } from '../events/PasswordRecoveryCodeCreatedEvent';
import { UserAccountsConfig } from '../../config';
import { PasswordRecoveriesRepository } from '../../infrastructure/passwordRecoveries.repository';

export class RecoverPasswordCommand {
  constructor(public readonly email: string) {}
}

@CommandHandler(RecoverPasswordCommand)
export class RecoverPasswordUseCase
  implements ICommandHandler<RecoverPasswordCommand, void>
{
  constructor(
    private passwordRecoveriesRepository: PasswordRecoveriesRepository,
    private usersRepository: UsersRepository,
    private eventBus: EventBus,
    private usersConfig: UserAccountsConfig,
  ) {}

  async execute({ email }: RecoverPasswordCommand) {
    const user = await this.usersRepository.findUserByEmail(email);

    if (!user) return;

    const passwordRecoveryCode = randomUUID();
    const expirationTimeInHours =
      this.usersConfig.RECOVERY_CODE_EXPIRATION_TIME_IN_HOURS;
    const expirationDate = add(new Date(), { hours: expirationTimeInHours });

    const passwordRecovery =
      await this.passwordRecoveriesRepository.findPasswordRecoveryByUserId(
        user.id,
      );

    if (!passwordRecovery) {
      const createdPasswordRecovery = this.passwordRecoveriesRepository.create({
        userId: user.id,
        expirationDate,
        recoveryCode: passwordRecoveryCode,
      });
      await this.passwordRecoveriesRepository.save(createdPasswordRecovery);
    } else {
      passwordRecovery.recoveryCode = passwordRecoveryCode;
      passwordRecovery.expirationDate = expirationDate;
      await this.passwordRecoveriesRepository.save(passwordRecovery);
    }

    // sent recovery email
    this.eventBus.publish(
      new PasswordRecoveryCodeCreatedEvent(user.email, passwordRecoveryCode),
    );
  }
}
