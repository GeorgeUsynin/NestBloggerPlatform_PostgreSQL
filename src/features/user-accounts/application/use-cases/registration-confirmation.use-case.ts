import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/users.repository';
import { BadRequestDomainException } from '../../../../core/exceptions/domain-exceptions';

export class RegistrationConfirmationCommand {
  constructor(public readonly code: string) {}
}

@CommandHandler(RegistrationConfirmationCommand)
export class RegistrationConfirmationUseCase
  implements ICommandHandler<RegistrationConfirmationCommand, void>
{
  constructor(private usersRepository: UsersRepository) {}

  async execute({ code }: RegistrationConfirmationCommand) {
    const user =
      await this.usersRepository.findUserByConfirmationEmailCode(code);

    if (!user) {
      throw BadRequestDomainException.create('Invalid code', 'code');
    }

    user.confirmUserEmail(code);

    await this.usersRepository.save(user);
  }
}
