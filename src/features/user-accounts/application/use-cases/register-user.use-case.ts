import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserDto } from '../../domain/dto/create/users.create-dto';
import { UsersRepository } from '../../infrastructure/users.repository';
import { BadRequestDomainException } from '../../../../core/exceptions/domain-exceptions';
import { CreateUserCommand } from './create-user.use-case';
import { RegistrationService } from '../registration.service';

export class RegisterUserCommand {
  constructor(public readonly dto: CreateUserDto) {}
}

@CommandHandler(RegisterUserCommand)
export class RegisterUserUseCase
  implements ICommandHandler<RegisterUserCommand, void>
{
  constructor(
    private usersRepository: UsersRepository,
    private registrationService: RegistrationService,
    private commandBus: CommandBus,
  ) {}

  async execute({ dto }: RegisterUserCommand) {
    const { login, email } = dto;

    // check if user already exists
    const userWithLogin = await this.usersRepository.findUserByLogin(login);
    const userWithEmail = await this.usersRepository.findUserByEmail(email);

    if (userWithLogin || userWithEmail) {
      const message = `User with this ${userWithLogin ? 'login' : 'email'} already exists`;
      const field = userWithLogin ? 'login' : 'email';

      throw BadRequestDomainException.create(message, field);
    }

    const createdUserId = await this.commandBus.execute<
      CreateUserCommand,
      number
    >(new CreateUserCommand(dto, true));

    const newUser =
      await this.usersRepository.findUserByIdOrNotFoundFail(createdUserId);

    const usersEmailConfirmation =
      await this.usersRepository.findEmailConfirmationByUserId(createdUserId);

    if (!usersEmailConfirmation.isConfirmed) {
      await this.registrationService.sendEmailConfirmationCode(newUser);
    }
  }
}
