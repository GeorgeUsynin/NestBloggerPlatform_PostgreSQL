import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../../infrastructure/posts.repository';

export class DeletePostCommand {
  constructor(public readonly id: string) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostUseCase
  implements ICommandHandler<DeletePostCommand, void>
{
  constructor(private postsRepository: PostsRepository) {}

  async execute({ id }: DeletePostCommand) {
    const post = await this.postsRepository.findPostByIdOrNotFoundFail(id);

    post.makeDeleted();

    await this.postsRepository.save(post);
  }
}
