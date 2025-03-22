import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LikesRepository } from '../../../infrastructure/likes.repository';
import { UpdateLikeStatusCommand, UpdateLikesUseCase } from '../likes';
import { DBPost } from '../../../infrastructure/types';
import { PostsRepository } from '../../../infrastructure/posts.repository';

export class UpdatePostLikeStatusCommand extends UpdateLikeStatusCommand {}

@CommandHandler(UpdatePostLikeStatusCommand)
export class UpdateLikePostStatusUseCase
  extends UpdateLikesUseCase<DBPost>
  implements ICommandHandler<UpdatePostLikeStatusCommand, void>
{
  constructor(
    private postsRepository: PostsRepository,
    likesRepository: LikesRepository,
  ) {
    super(likesRepository);
  }

  checkThatLikableEntityExists(id: number): Promise<DBPost> {
    return this.postsRepository.findPostByIdOrNotFoundFail(id);
  }
}
