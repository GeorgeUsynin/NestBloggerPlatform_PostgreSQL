import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/users.repository';

export class DeleteUserCommand {
  constructor(public readonly userId: string) {}
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserUseCase
  implements ICommandHandler<DeleteUserCommand, void>
{
  constructor(private usersRepository: UsersRepository) {}

  async execute({ userId }: DeleteUserCommand) {
    const user = await this.usersRepository.findUserByIdOrNotFoundFail(userId);

    user.makeDeleted();

    await this.usersRepository.save(user);
  }
}
