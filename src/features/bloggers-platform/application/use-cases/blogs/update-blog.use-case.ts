import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateBlogDto } from '../../../domain/dto/update/blogs.update-dto';
import { BlogsRepository } from '../../../infrastructure/blogs.repository';

export class UpdateBlogCommand {
  constructor(
    public readonly blogId: string,
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

    // don't assign properties directly to entities in services! even for changing a single property
    // create a method instead
    blog.update(dto); // change detection

    await this.blogsRepository.save(blog);
  }
}
