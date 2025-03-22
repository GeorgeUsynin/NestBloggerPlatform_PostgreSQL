import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LikesRepository } from '../../../infrastructure/likes.repository';
import { UpdateLikeStatusCommand, UpdateLikesUseCase } from '../likes';
import { DBComment } from '../../../infrastructure/types';
import { CommentsRepository } from '../../../infrastructure/comments.repository';

export class UpdateCommentLikeStatusCommand extends UpdateLikeStatusCommand {}

@CommandHandler(UpdateCommentLikeStatusCommand)
export class UpdateLikeCommentStatusUseCase
  extends UpdateLikesUseCase<DBComment>
  implements ICommandHandler<UpdateCommentLikeStatusCommand, void>
{
  constructor(
    private commentsRepository: CommentsRepository,
    likesRepository: LikesRepository,
  ) {
    super(likesRepository);
  }

  checkThatLikableEntityExists(id: number): Promise<DBComment> {
    return this.commentsRepository.findCommentByIdOrNotFoundFail(id);
  }
}
