import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdatePostDto } from '../../../domain/dto/update/posts.update-dto';
import { PostsRepository } from '../../../infrastructure/posts.repository';
import { BlogsRepository } from '../../../infrastructure/blogs.repository';
import { NotFoundDomainException } from '../../../../../core/exceptions/domain-exceptions';

export class UpdatePostByBlogIdAndPostIdCommand {
  constructor(
    public readonly blogId: number,
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

  async execute({ blogId, postId, dto }: UpdatePostByBlogIdAndPostIdCommand) {
    const blog = await this.blogsRepository.findBlogById(blogId);

    // Check that blog is exist
    if (!blog) {
      throw NotFoundDomainException.create('Blog not found', 'blogId');
    }

    const post = await this.postsRepository.findPostByIdOrNotFoundFail(postId);

    // Updating and saving post
    post.content = dto.content;
    post.shortDescription = dto.shortDescription;
    post.title = dto.title;
    await this.postsRepository.save(post);
  }
}
