import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Like, LikeModelType } from '../../../domain/like.entity';
import { PostsRepository } from '../../../infrastructure/posts.repository';
import { LikesRepository } from '../../../infrastructure/likes.repository';
import { PostDocument } from '../../../domain/post.entity';
import {
  UpdateLikeEntityStatusCommand,
  UpdateLikesEntityUseCase,
} from '../update-likes-entity.use-case';

export class UpdateLikePostStatusCommand extends UpdateLikeEntityStatusCommand {}

@CommandHandler(UpdateLikePostStatusCommand)
export class UpdateLikePostStatusUseCase
  extends UpdateLikesEntityUseCase<PostDocument>
  implements ICommandHandler<UpdateLikePostStatusCommand, void>
{
  constructor(
    @InjectModel(Like.name)
    LikeModel: LikeModelType,
    likesRepository: LikesRepository,
    private postsRepository: PostsRepository,
  ) {
    super(LikeModel, likesRepository);
  }

  getLikeableEntityById(id: string): Promise<PostDocument> {
    // @ts-expect-error
    return this.postsRepository.findPostByIdOrNotFoundFail(id);
  }

  saveEntity(entity: PostDocument): Promise<PostDocument> {
    return this.postsRepository.save(entity);
  }
}
