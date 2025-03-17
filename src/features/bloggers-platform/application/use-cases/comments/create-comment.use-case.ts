import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../../infrastructure/comments.repository';
import { PostsRepository } from '../../../infrastructure/posts.repository';
import { CreateCommentDto } from '../../../application/dto/create/comments.create-dto';
import { UsersRepository } from '../../../../user-accounts/infrastructure/users.repository';
import { Comment, CommentModelType } from '../../../domain/comment.entity';
import { InjectModel } from '@nestjs/mongoose';

export class CreateCommentCommand {
  constructor(public readonly dto: CreateCommentDto) {}
}

@CommandHandler(CreateCommentCommand)
export class CreateCommentUseCase
  implements ICommandHandler<CreateCommentCommand, string>
{
  constructor(
    @InjectModel(Comment.name)
    private CommentModel: CommentModelType,
    private commentsRepository: CommentsRepository,
    private postsRepository: PostsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({ dto }: CreateCommentCommand) {
    // Check tah post is exist
    await this.postsRepository.findPostByIdOrNotFoundFail(dto.postId);

    // Looking for a user
    const user = await this.usersRepository.findUserByIdOrNotFoundFail(
      dto.userId,
    );

    const newComment = this.CommentModel.createComment({
      content: dto.content,
      userId: user.id,
      userLogin: user.login,
      postId: dto.postId,
    });

    await this.commentsRepository.save(newComment);

    return newComment._id.toString();
  }
}
