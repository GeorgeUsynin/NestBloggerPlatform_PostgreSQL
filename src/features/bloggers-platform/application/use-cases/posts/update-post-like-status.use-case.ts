import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LikesRepository } from '../../../infrastructure/likes.repository';
import { UpdateLikeStatusCommand, UpdateLikesUseCase } from '../likes';
import { PostsRepository } from '../../../infrastructure/posts.repository';
import { Post } from '../../../domain/post.entity';

export class UpdatePostLikeStatusCommand extends UpdateLikeStatusCommand {}

@CommandHandler(UpdatePostLikeStatusCommand)
export class UpdateLikePostStatusUseCase
  extends UpdateLikesUseCase<Post>
  implements ICommandHandler<UpdatePostLikeStatusCommand, void>
{
  constructor(
    private postsRepository: PostsRepository,
    likesRepository: LikesRepository,
  ) {
    super(likesRepository);
  }

  checkThatLikableEntityExists(id: number): Promise<Post> {
    return this.postsRepository.findPostByIdOrNotFoundFail(id);
  }
}
