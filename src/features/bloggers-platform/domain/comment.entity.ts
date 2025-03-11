import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, SchemaTimestampsConfig } from 'mongoose';
import { CreateCommentDto } from './dto/create/comments.create-dto';
import { UpdateCommentDto } from './dto/update/comments.update-dto';
import { ForbiddenDomainException } from '../../../core/exceptions/domain-exceptions';
import { Likeable } from './shared.entity';

export enum DeletionStatus {
  NotDeleted = 'not-deleted',
  PermanentDeleted = 'permanent-deleted',
}

export const contentConstraints = {
  minLength: 20,
  maxLength: 300,
};

// The timestamp flag automatically adds the updatedAt and createdAt fields
@Schema({ timestamps: true })
export class Comment extends Likeable {
  @Prop({ type: String, required: true, ...contentConstraints })
  content: string;

  @Prop({
    type: {
      userId: { type: String, required: true },
      userLogin: { type: String, required: true },
    },
    required: true,
    _id: false,
  })
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };

  @Prop({ type: String, required: true })
  postId: string;

  @Prop({ enum: DeletionStatus, default: DeletionStatus.NotDeleted })
  deletionStatus: DeletionStatus;

  static createComment(dto: CreateCommentDto): CommentDocument {
    // CommentDocument!
    const comment = new this(); //this will be a CommentModel when we will call createComment method!

    comment.content = dto.content;
    comment.commentatorInfo = { userId: dto.userId, userLogin: dto.userLogin };
    comment.postId = dto.postId;

    return comment as CommentDocument;
  }

  makeDeleted() {
    if (this.deletionStatus !== DeletionStatus.NotDeleted) {
      throw new Error('Entity already deleted');
    }
    this.deletionStatus = DeletionStatus.PermanentDeleted;
  }

  update(dto: UpdateCommentDto) {
    this.content = dto.content;
  }

  isCommentOwner(userId: string) {
    if (this.commentatorInfo.userId !== userId) {
      throw ForbiddenDomainException.create(
        'You are not allowed to modify this comment',
      );
    }

    return true;
  }
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

// Registers the entity methods in the schema
CommentSchema.loadClass(Comment);

// Type of the document
export type CommentDocument = HydratedDocument<Comment> &
  SchemaTimestampsConfig;

// Type of the model + static methods
export type CommentModelType = Model<CommentDocument> & typeof Comment;
