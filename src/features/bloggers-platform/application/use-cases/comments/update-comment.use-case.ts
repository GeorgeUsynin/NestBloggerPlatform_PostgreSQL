import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../../infrastructure/comments.repository';
import { UpdateCommentDto } from '../../../domain/dto/update/comments.update-dto';
import { ForbiddenDomainException } from '../../../../../core/exceptions/domain-exceptions';

export class UpdateCommentCommand {
  constructor(
    public readonly commentId: number,
    public readonly userId: number,
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

    if (comment.userId === userId) {
      comment.content = dto.content;
      await this.commentsRepository.save(comment);
    } else {
      throw ForbiddenDomainException.create(
        'You are not allowed to modify this comment',
      );
    }
  }
}
