import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../../infrastructure/comments.repository';
import { UpdateCommentDto } from '../../../domain/dto/update/comments.update-dto';

export class UpdateCommentCommand {
  constructor(
    public readonly commentId: string,
    public readonly userId: string,
    public readonly dto: UpdateCommentDto,
  ) {}
}

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentUseCase
  implements ICommandHandler<UpdateCommentCommand, void>
{
  constructor(private commentsRepository: CommentsRepository) {}

  async execute({ commentId, userId, dto }: UpdateCommentCommand) {
    const comment =
      await this.commentsRepository.findCommentByIdOrNotFoundFail(commentId);

    if (comment.isCommentOwner(userId)) {
      comment.update(dto);

      await this.commentsRepository.save(comment);
    }
  }
}
