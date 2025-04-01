import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestDomainException } from '../../../../core/exceptions/domain-exceptions';
import { EmailConfirmationsRepository } from '../../infrastructure/emailConfirmations.repository';

export class RegistrationConfirmationCommand {
  constructor(public readonly code: string) {}
}

@CommandHandler(RegistrationConfirmationCommand)
export class RegistrationConfirmationUseCase
  implements ICommandHandler<RegistrationConfirmationCommand, void>
{
  constructor(
    private emailConfirmationsRepository: EmailConfirmationsRepository,
  ) {}

  async execute({ code }: RegistrationConfirmationCommand) {
    const emailConfirmation =
      await this.emailConfirmationsRepository.findEmailConfirmationByConfirmationCode(
        code,
      );

    if (!emailConfirmation) {
      throw BadRequestDomainException.create('Invalid code', 'code');
    }

    if (emailConfirmation.isConfirmed) {
      throw BadRequestDomainException.create('Email already confirmed', 'code');
    }

    if (emailConfirmation.confirmationCode !== code) {
      throw BadRequestDomainException.create('Invalid code', 'code');
    }

    if (!emailConfirmation.expirationDate) {
      throw new Error('Expiration date for email confirmation is not set');
    }

    if (Date.now() > emailConfirmation.expirationDate.getTime()) {
      throw BadRequestDomainException.create('Code expired', 'code');
    }

    // Update emailConfirmation isConfirmed
    emailConfirmation.isConfirmed = true;
    await this.emailConfirmationsRepository.save(emailConfirmation);
  }
}
