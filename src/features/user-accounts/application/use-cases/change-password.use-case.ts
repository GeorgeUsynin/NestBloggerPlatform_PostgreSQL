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
    const user =
      await this.usersRepository.findUserByRecoveryPasswordCode(recoveryCode);

    if (!user) {
      throw BadRequestDomainException.create('Invalid code', 'recoveryCode');
    }

    const passwordHash =
      await this.cryptoService.generatePasswordHash(newPassword);

    user.changePassword(recoveryCode, passwordHash);

    await this.usersRepository.save(user);
  }
}
