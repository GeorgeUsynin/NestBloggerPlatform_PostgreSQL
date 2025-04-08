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
    const newBlog = this.blogsRepository.create(dto);
    await this.blogsRepository.save(newBlog);

    return newBlog.id;
  }
}
