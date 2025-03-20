import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdatePostDto } from '../../../domain/dto/update/posts.update-dto';
import { PostsRepository } from '../../../infrastructure/posts.repository';
import { BlogsRepository } from '../../../infrastructure/blogs.repository';
import { NotFoundDomainException } from '../../../../../core/exceptions/domain-exceptions';

export class UpdatePostByBlogIdAndPostIdCommand {
  constructor(
    public readonly postId: number,
    public readonly dto: UpdatePostDto,
  ) {}
}

@CommandHandler(UpdatePostByBlogIdAndPostIdCommand)
export class UpdatePostByBlogIdAndPostIdUseCase
  implements ICommandHandler<UpdatePostByBlogIdAndPostIdCommand, void>
{
  constructor(
    private postsRepository: PostsRepository,
    private blogsRepository: BlogsRepository,
  ) {}

  async execute({ postId, dto }: UpdatePostByBlogIdAndPostIdCommand) {
    const blogId = Number(dto.blogId);
    const blog = await this.blogsRepository.findBlogById(blogId);

    // Check that blog is exist
    if (!blog) {
      throw NotFoundDomainException.create('Blog not found', 'blogId');
    }

    await this.postsRepository.findPostByIdOrNotFoundFail(postId);

    await this.postsRepository.update(postId, dto);
  }
}
