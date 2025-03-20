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
    await this.blogsRepository.findBlogByIdOrNotFoundFail(blogId);

    await this.blogsRepository.update(blogId, dto);
  }
}
