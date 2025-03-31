import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CryptoService } from '../crypto.service';
import { UsersRepository } from '../../infrastructure/users.repository';
import { CreateUserInputDto } from '../../api/dto/input-dto/create/users.input-dto';
import { EmailConfirmationsRepository } from '../../infrastructure/emailConfirmations.repository';

export class CreateUserBySuperAdminCommand {
  constructor(public readonly dto: CreateUserInputDto) {}
}

@CommandHandler(CreateUserBySuperAdminCommand)
export class CreateUserBySuperAdminUseCase
  implements ICommandHandler<CreateUserBySuperAdminCommand, number>
{
  constructor(
    private usersRepository: UsersRepository,
    private emailConfirmationsRepository: EmailConfirmationsRepository,
    private cryptoService: CryptoService,
  ) {}

  async execute({ dto }: CreateUserBySuperAdminCommand) {
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

    // Automatically confirm user because he was created by Super Admin
    const emailConfirmation = this.emailConfirmationsRepository.create({
      userId,
      isConfirmed: true,
    });
    await this.emailConfirmationsRepository.save(emailConfirmation);

    return userId;
  }
}
