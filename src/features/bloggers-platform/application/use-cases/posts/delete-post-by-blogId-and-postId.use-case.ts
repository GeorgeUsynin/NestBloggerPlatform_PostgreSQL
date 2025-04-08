import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../../infrastructure/posts.repository';
import { BlogsRepository } from '../../../infrastructure/blogs.repository';

export class DeletePostByBlogIdAndPostIdCommand {
  constructor(
    public readonly blogId: number,
    public readonly postId: number,
  ) {}
}

@CommandHandler(DeletePostByBlogIdAndPostIdCommand)
export class DeletePostByBlogIdAndPostIdUseCase
  implements ICommandHandler<DeletePostByBlogIdAndPostIdCommand, void>
{
  constructor(
    private postsRepository: PostsRepository,
    private blogsRepository: BlogsRepository,
  ) {}

  async execute({ blogId, postId }: DeletePostByBlogIdAndPostIdCommand) {
    await this.blogsRepository.findBlogByIdOrNotFoundFail(blogId);
    await this.postsRepository.findPostByIdOrNotFoundFail(postId);

    await this.postsRepository.softDeletePostById(postId);
  }
}
