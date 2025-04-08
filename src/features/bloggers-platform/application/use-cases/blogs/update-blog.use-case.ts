import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateBlogDto } from '../../../domain/dto/update/blogs.update-dto';
import { BlogsRepository } from '../../../infrastructure/blogs.repository';

export class UpdateBlogCommand {
  constructor(
    public readonly blogId: number,
    public readonly dto: UpdateBlogDto,
  ) {}
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogUseCase
  implements ICommandHandler<UpdateBlogCommand, void>
{
  constructor(private blogsRepository: BlogsRepository) {}

  async execute({ blogId, dto }: UpdateBlogCommand) {
    const blog = await this.blogsRepository.findBlogByIdOrNotFoundFail(blogId);

    blog.name = dto.name;
    blog.description = dto.description;
    blog.websiteUrl = dto.websiteUrl;

    await this.blogsRepository.save(blog);
  }
}
