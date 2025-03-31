import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CryptoService } from '../crypto.service';
import { CreateUserInputDto } from '../../api/dto/input-dto/create/users.input-dto';
import { UsersRepository } from '../../infrastructure/users.repository';

export class CreateUserCommand {
  constructor(public readonly dto: CreateUserInputDto) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase
  implements ICommandHandler<CreateUserCommand, number>
{
  constructor(
    private usersRepository: UsersRepository,
    private cryptoService: CryptoService,
  ) {}

  async execute({ dto }: CreateUserCommand) {
    const { email, login, password } = dto;

    const passwordHash =
      await this.cryptoService.generatePasswordHash(password);

    // Create and save new user
    const user = this.usersRepository.create({
      login,
      email,
      passwordHash,
    });
    const { id: userId } = await this.usersRepository.save(user);

    return userId;
  }
}
