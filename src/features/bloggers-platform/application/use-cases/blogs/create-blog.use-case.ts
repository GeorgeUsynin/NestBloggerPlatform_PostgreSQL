import { InjectModel } from '@nestjs/mongoose';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateBlogDto } from '../../../domain/dto/create/blogs.create-dto';
import { Blog, BlogModelType } from '../../../domain/blog.entity';
import { BlogsRepository } from '../../../infrastructure/blogs.repository';

export class CreateBlogCommand {
  constructor(public readonly dto: CreateBlogDto) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase
  implements ICommandHandler<CreateBlogCommand, string>
{
  constructor(
    @InjectModel(Blog.name)
    private BlogModel: BlogModelType,
    private blogsRepository: BlogsRepository,
  ) {}

  async execute({ dto }: CreateBlogCommand) {
    const newBlog = this.BlogModel.createBlog(dto);

    await this.blogsRepository.save(newBlog);

    return newBlog._id.toString();
  }
}
