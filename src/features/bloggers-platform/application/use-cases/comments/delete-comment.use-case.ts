import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../../infrastructure/comments.repository';

export class DeleteCommentCommand {
  constructor(
    public readonly commentId: string,
    public readonly userId: string,
  ) {}
}

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentUseCase
  implements ICommandHandler<DeleteCommentCommand, void>
{
  constructor(private commentsRepository: CommentsRepository) {}

  async execute({ commentId, userId }: DeleteCommentCommand) {
    const comment =
      await this.commentsRepository.findCommentByIdOrNotFoundFail(commentId);

    if (comment.isCommentOwner(userId)) {
      comment.makeDeleted();
      await this.commentsRepository.save(comment);
    }
  }
}
