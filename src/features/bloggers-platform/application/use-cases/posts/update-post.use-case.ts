import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdatePostDto } from '../../../domain/dto/update/posts.update-dto';
import { PostsRepository } from '../../../infrastructure/posts.repository';
import { BlogsRepository } from '../../../infrastructure/blogs.repository';
import { BadRequestDomainException } from '../../../../../core/exceptions/domain-exceptions';

export class UpdatePostCommand {
  constructor(
    public readonly postId: string,
    public readonly dto: UpdatePostDto,
  ) {}
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostUseCase
  implements ICommandHandler<UpdatePostCommand, void>
{
  constructor(
    private postsRepository: PostsRepository,
    private blogsRepository: BlogsRepository,
  ) {}

  async execute({ postId, dto }: UpdatePostCommand) {
    //@ts-expect-error
    const blog = await this.blogsRepository.findBlogById(dto.blogId);

    // Check that blog is exist
    if (!blog) {
      throw BadRequestDomainException.create('Blog not found', 'blogId');
    }

    // @ts-expect-error
    const post = await this.postsRepository.findPostByIdOrNotFoundFail(postId);

    // don't assign properties directly to entities in services! even for changing a single property
    // create a method instead
    post.update(dto); // change detection

    await this.postsRepository.save(post);
  }
}
