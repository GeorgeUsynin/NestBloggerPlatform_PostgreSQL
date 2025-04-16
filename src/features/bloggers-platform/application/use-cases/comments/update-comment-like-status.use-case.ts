import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LikesRepository } from '../../../infrastructure/likes.repository';
import { UpdateLikeStatusCommand, UpdateLikesUseCase } from '../likes';
import { CommentsRepository } from '../../../infrastructure/comments.repository';
import { Comment } from '../../../domain/comment.entity';

export class UpdateCommentLikeStatusCommand extends UpdateLikeStatusCommand {}

@CommandHandler(UpdateCommentLikeStatusCommand)
export class UpdateLikeCommentStatusUseCase
  extends UpdateLikesUseCase<Comment>
  implements ICommandHandler<UpdateCommentLikeStatusCommand, void>
{
  constructor(
    private commentsRepository: CommentsRepository,
    likesRepository: LikesRepository,
  ) {
    super(likesRepository);
  }

  checkThatLikableEntityExists(id: number): Promise<Comment> {
    return this.commentsRepository.findCommentByIdOrNotFoundFail(id);
  }
}
