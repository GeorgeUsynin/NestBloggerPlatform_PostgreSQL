import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Comment,
  CommentDocument,
  CommentModelType,
  DeletionStatus,
} from '../domain/comment.entity';
import { NotFoundDomainException } from '../../../core/exceptions/domain-exceptions';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(Comment.name)
    private CommentModel: CommentModelType,
  ) {}

  async findCommentByIdOrNotFoundFail(id: string) {
    const comment = await this.CommentModel.findOne({
      _id: id,
      deletionStatus: { $ne: DeletionStatus.PermanentDeleted },
    });

    if (!comment) {
      throw NotFoundDomainException.create('Comment not found');
    }
    return comment;
  }

  async save(comment: CommentDocument) {
    return comment.save();
  }
}
