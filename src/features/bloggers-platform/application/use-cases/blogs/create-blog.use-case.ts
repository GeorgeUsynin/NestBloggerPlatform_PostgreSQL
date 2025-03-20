import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateBlogDto } from '../../../domain/dto/create/blogs.create-dto';
import { BlogsRepository } from '../../../infrastructure/blogs.repository';

export class CreateBlogCommand {
  constructor(public readonly dto: CreateBlogDto) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase
  implements ICommandHandler<CreateBlogCommand, number>
{
  constructor(private blogsRepository: BlogsRepository) {}

  async execute({ dto }: CreateBlogCommand) {
    const newBlogId = await this.blogsRepository.createBlog(dto);

    return newBlogId;
  }
}
