import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/users.repository';
import { BadRequestDomainException } from '../../../../core/exceptions/domain-exceptions';
import { RegistrationService } from '../registration.service';

export class RegistrationEmailResendingCommand {
  constructor(public readonly email: string) {}
}

@CommandHandler(RegistrationEmailResendingCommand)
export class RegistrationEmailResendingUseCase
  implements ICommandHandler<RegistrationEmailResendingCommand, void>
{
  constructor(
    private usersRepository: UsersRepository,
    private registrationService: RegistrationService,
  ) {}

  async execute({ email }: RegistrationEmailResendingCommand) {
    const user = await this.usersRepository.findUserByEmailSQL(email);

    if (!user) {
      throw BadRequestDomainException.create(
        'User with this email not found',
        'email',
      );
    }

    await this.registrationService.sendEmailConfirmationCode(user);
  }
}
