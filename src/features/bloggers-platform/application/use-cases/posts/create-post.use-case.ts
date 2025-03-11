import { InjectModel } from '@nestjs/mongoose';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../../infrastructure/blogs.repository';
import { CreatePostDto } from '../../dto/create/posts.create-dto';
import { Post, PostModelType } from '../../../domain/post.entity';
import { PostsRepository } from '../../../infrastructure/posts.repository';

export class CreatePostCommand {
  constructor(public readonly dto: CreatePostDto) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase
  implements ICommandHandler<CreatePostCommand, string>
{
  constructor(
    @InjectModel(Post.name)
    private PostModel: PostModelType,
    private postsRepository: PostsRepository,
    private blogsRepository: BlogsRepository,
  ) {}

  async execute({ dto }: CreatePostCommand) {
    const blog = await this.blogsRepository.findBlogByIdOrNotFoundFail(
      dto.blogId,
    );

    const newPost = this.PostModel.createPost({
      ...dto,
      blogName: blog.name,
    });

    await this.postsRepository.save(newPost);

    return newPost._id.toString();
  }
}
