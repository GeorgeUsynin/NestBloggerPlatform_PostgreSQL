import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/users.repository';
import { CryptoService } from '../crypto.service';
import { CreateUserDto } from '../../domain/dto/create/users.create-dto';
import { UserAccountsConfig } from '../../config';

export class CreateUserCommand {
  constructor(
    public readonly dto: CreateUserDto,
    public readonly isFromRegistration: boolean,
  ) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase
  implements ICommandHandler<CreateUserCommand, number>
{
  constructor(
    private usersRepository: UsersRepository,
    private cryptoService: CryptoService,
    private usersConfig: UserAccountsConfig,
  ) {}

  async execute({ dto, isFromRegistration }: CreateUserCommand) {
    const passwordHash = await this.cryptoService.generatePasswordHash(
      dto.password,
    );

    const userId = await this.usersRepository.createUser({
      ...dto,
      password: passwordHash,
    });

    if (
      !isFromRegistration &&
      this.usersConfig.IS_USER_AUTOMATICALLY_CONFIRMED
    ) {
      await this.usersRepository.updateIsConfirmedByUserId(userId, true);
    }

    return userId;
  }
}
