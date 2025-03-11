import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Like, LikeModelType } from '../../../domain/like.entity';
import { CommentDocument } from '../../../domain/comment.entity';
import { CommentsRepository } from '../../../infrastructure/comments.repository';
import { LikesRepository } from '../../../infrastructure/likes.repository';
import {
  UpdateLikeEntityStatusCommand,
  UpdateLikesEntityUseCase,
} from '../update-likes-entity.use-case';

export class UpdateLikeCommentStatusCommand extends UpdateLikeEntityStatusCommand {}

@CommandHandler(UpdateLikeCommentStatusCommand)
export class UpdateLikeCommentStatusUseCase
  extends UpdateLikesEntityUseCase<CommentDocument>
  implements ICommandHandler<UpdateLikeCommentStatusCommand, void>
{
  constructor(
    @InjectModel(Like.name)
    LikeModel: LikeModelType,
    likesRepository: LikesRepository,
    private commentsRepository: CommentsRepository,
  ) {
    super(LikeModel, likesRepository);
  }

  getLikeableEntityById(id: string): Promise<CommentDocument> {
    return this.commentsRepository.findCommentByIdOrNotFoundFail(id);
  }

  saveEntity(entity: CommentDocument): Promise<CommentDocument> {
    return this.commentsRepository.save(entity);
  }
}
