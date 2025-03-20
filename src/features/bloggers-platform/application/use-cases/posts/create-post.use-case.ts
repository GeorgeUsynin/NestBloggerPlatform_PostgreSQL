import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../../infrastructure/blogs.repository';
import { CreatePostDto } from '../../dto/create/posts.create-dto';
import { PostsRepository } from '../../../infrastructure/posts.repository';

export class CreatePostCommand {
  constructor(public readonly dto: CreatePostDto) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase
  implements ICommandHandler<CreatePostCommand, number>
{
  constructor(
    private postsRepository: PostsRepository,
    private blogsRepository: BlogsRepository,
  ) {}

  async execute({ dto }: CreatePostCommand) {
    const blogId = Number(dto.blogId);

    const blog = await this.blogsRepository.findBlogByIdOrNotFoundFail(blogId);

    const newPostId = await this.postsRepository.createPost({
      ...dto,
      blogId,
      blogName: blog.name,
    });

    return newPostId;
  }
}
