import { InjectModel } from '@nestjs/mongoose';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { User, UserModelType } from '../../domain/user.entity';
import { UsersRepository } from '../../infrastructure/users.repository';
import { CryptoService } from '../crypto.service';
import { CreateUserDto } from '../../domain/dto/create/users.create-dto';
import { UserAccountsConfig } from '../../config';

export class CreateUserCommand {
  constructor(public readonly dto: CreateUserDto) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase
  implements ICommandHandler<CreateUserCommand, string>
{
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModelType,
    private usersRepository: UsersRepository,
    private cryptoService: CryptoService,
    private usersConfig: UserAccountsConfig,
  ) {}

  async execute({ dto }: CreateUserCommand) {
    const passwordHash = await this.cryptoService.generatePasswordHash(
      dto.password,
    );

    const user = this.UserModel.createUser({
      email: dto.email,
      login: dto.login,
      password: passwordHash,
    });

    if (this.usersConfig.IS_USER_AUTOMATICALLY_CONFIRMED) {
      user.emailConfirmation.isConfirmed = true;
    }

    await this.usersRepository.save(user);

    return user._id.toString();
  }
}
