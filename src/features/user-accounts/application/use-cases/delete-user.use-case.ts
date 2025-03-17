import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/users.repository';

export class DeleteUserCommand {
  constructor(public readonly userId: number) {}
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserUseCase
  implements ICommandHandler<DeleteUserCommand, void>
{
  constructor(private usersRepository: UsersRepository) {}

  async execute({ userId }: DeleteUserCommand) {
    await this.usersRepository.findUserByIdOrNotFoundFailSQL(userId);

    await this.usersRepository.deleteUserById(userId);
  }
}
