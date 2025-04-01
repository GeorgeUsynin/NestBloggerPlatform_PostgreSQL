import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/users.repository';
import { BadRequestDomainException } from '../../../../core/exceptions/domain-exceptions';
import { CreateUserCommand } from './create-user.use-case';
import { RegistrationService } from '../registration.service';
import { CreateUserInputDto } from '../../api/dto/input-dto/create/users.input-dto';
import { EmailConfirmationsRepository } from '../../infrastructure/emailConfirmations.repository';
import { UserAccountsConfig } from '../../config';

export class RegisterUserCommand {
  constructor(public readonly dto: CreateUserInputDto) {}
}

@CommandHandler(RegisterUserCommand)
export class RegisterUserUseCase
  implements ICommandHandler<RegisterUserCommand, void>
{
  constructor(
    private usersRepository: UsersRepository,
    private emailConfirmationsRepository: EmailConfirmationsRepository,
    private registrationService: RegistrationService,
    private userAccountConfig: UserAccountsConfig,
    private commandBus: CommandBus,
  ) {}

  async execute({ dto }: RegisterUserCommand) {
    const { login, email } = dto;

    // Check if user already exists
    const userWithLogin = await this.usersRepository.findUserByLogin(login);
    const userWithEmail = await this.usersRepository.findUserByEmail(email);

    if (userWithLogin || userWithEmail) {
      const message = `User with this ${userWithLogin ? 'login' : 'email'} already exists`;
      const field = userWithLogin ? 'login' : 'email';

      throw BadRequestDomainException.create(message, field);
    }

    // Creating new user
    const userId = await this.commandBus.execute<CreateUserCommand, number>(
      new CreateUserCommand(dto),
    );

    // Creating email confirmation
    const emailConfirmation = this.emailConfirmationsRepository.create({
      userId,
      isConfirmed: this.userAccountConfig.IS_USER_AUTOMATICALLY_CONFIRMED,
    });
    const { isConfirmed } =
      await this.emailConfirmationsRepository.save(emailConfirmation);

    // Sending email
    if (!isConfirmed) {
      await this.registrationService.sendEmailConfirmationCode(userId, email);
    }
  }
}
