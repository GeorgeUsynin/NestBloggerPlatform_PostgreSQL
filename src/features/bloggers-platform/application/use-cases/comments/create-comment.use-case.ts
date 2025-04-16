import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../../infrastructure/comments.repository';
import { PostsRepository } from '../../../infrastructure/posts.repository';
import { CreateCommentDto } from '../../../application/dto/create/comments.create-dto';

export class CreateCommentCommand {
  constructor(public readonly dto: CreateCommentDto) {}
}

@CommandHandler(CreateCommentCommand)
export class CreateCommentUseCase
  implements ICommandHandler<CreateCommentCommand, number>
{
  constructor(
    private commentsRepository: CommentsRepository,
    private postsRepository: PostsRepository,
  ) {}

  async execute({ dto }: CreateCommentCommand) {
    // Check that post is exist
    await this.postsRepository.findPostByIdOrNotFoundFail(dto.postId);

    const newComment = this.commentsRepository.create(dto);
    await this.commentsRepository.save(newComment);

    return newComment.id;
  }
}
