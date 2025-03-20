import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../../infrastructure/blogs.repository';

export class DeleteBlogCommand {
  constructor(public readonly id: number) {}
}

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogUseCase
  implements ICommandHandler<DeleteBlogCommand, void>
{
  constructor(private blogsRepository: BlogsRepository) {}

  async execute({ id }: DeleteBlogCommand) {
    await this.blogsRepository.findBlogByIdOrNotFoundFail(id);

    await this.blogsRepository.deleteBlogById(id);
  }
}
