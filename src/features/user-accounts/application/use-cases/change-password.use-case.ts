import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CryptoService } from '../crypto.service';
import { BadRequestDomainException } from '../../../../core/exceptions/domain-exceptions';
import { PasswordRecoveriesRepository } from '../../infrastructure/passwordRecoveries.repository';

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
    private passwordRecoveriesRepository: PasswordRecoveriesRepository,
    private cryptoService: CryptoService,
  ) {}

  async execute({ recoveryCode, newPassword }: ChangePasswordCommand) {
    const passwordRecovery =
      await this.passwordRecoveriesRepository.findPasswordRecoveryByRecoveryCode(
        recoveryCode,
        ['user'],
      );

    if (!passwordRecovery) {
      throw BadRequestDomainException.create('Invalid code', 'recoveryCode');
    }

    if (passwordRecovery.recoveryCode !== recoveryCode) {
      throw BadRequestDomainException.create('Invalid code', 'code');
    }

    if (!passwordRecovery.expirationDate) {
      throw new Error('Expiration date for email confirmation is not set');
    }

    if (Date.now() > passwordRecovery.expirationDate.getTime()) {
      throw BadRequestDomainException.create('Code expired', 'recoveryCode');
    }

    const newPasswordHash =
      await this.cryptoService.generatePasswordHash(newPassword);

    // Using user relations to update user's password
    // 1. Need to pass relations
    // 2. Need to add cascade: true into PasswordRecovery entity user relation
    passwordRecovery.user.passwordHash = newPasswordHash;
    await this.passwordRecoveriesRepository.save(passwordRecovery);
  }
}
