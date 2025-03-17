import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/users.repository';
import { CryptoService } from '../crypto.service';
import { BadRequestDomainException } from '../../../../core/exceptions/domain-exceptions';

export class ChangePasswordCommand {
  constructor(
    public readonly newPassword: string,
    public readonly recoveryCode: string,
  ) {}
}

@CommandHandler(ChangePasswordCommand)
export class ChangePasswordUseCase
  implements ICommandHandler<ChangePasswordCommand, void>
{
  constructor(
    private usersRepository: UsersRepository,
    private cryptoService: CryptoService,
  ) {}

  async execute({ recoveryCode, newPassword }: ChangePasswordCommand) {
    const passwordRecovery =
      await this.usersRepository.findPasswordRecoveryByRecoveryCode(
        recoveryCode,
      );

    if (!passwordRecovery) {
      throw BadRequestDomainException.create('Invalid code', 'recoveryCode');
    }

    const newPasswordHash =
      await this.cryptoService.generatePasswordHash(newPassword);

    if (passwordRecovery.recoveryCode !== recoveryCode) {
      throw BadRequestDomainException.create('Invalid code', 'code');
    }

    if (!passwordRecovery.expirationDate) {
      throw new Error('Expiration date for email confirmation is not set');
    }

    if (Date.now() > passwordRecovery.expirationDate.getTime()) {
      throw BadRequestDomainException.create('Code expired', 'recoveryCode');
    }

    await this.usersRepository.updateUsersPassword(
      passwordRecovery.userId,
      newPasswordHash,
    );
  }
}
