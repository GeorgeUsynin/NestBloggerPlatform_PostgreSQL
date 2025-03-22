import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../../infrastructure/comments.repository';
import { ForbiddenDomainException } from '../../../../../core/exceptions/domain-exceptions';

export class DeleteCommentCommand {
  constructor(
    public readonly commentId: number,
    public readonly userId: number,
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

    if (comment.userId === userId) {
      await this.commentsRepository.deleteCommentById(commentId);
    } else {
      throw ForbiddenDomainException.create(
        'You are not allowed to modify this comment',
      );
    }
  }
}
