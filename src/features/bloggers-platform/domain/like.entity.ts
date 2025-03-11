import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, SchemaTimestampsConfig } from 'mongoose';
import { CreateLikeDto } from './dto/create/likes.create-dto';
import { UpdateLikeDto } from './dto/update/likes.update-dto';

export enum LikeStatus {
  None = 'None',
  Like = 'Like',
  Dislike = 'Dislike',
}

@Schema({ timestamps: true })
export class Like {
  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: true })
  parentId: string;

  @Prop({ type: String, enum: LikeStatus, required: true })
  status: LikeStatus;

  static createLike(dto: CreateLikeDto): LikeDocument {
    // LikeDocument!
    const like = new this(); //this will be a LikeModel when we will call createLike method!

    like.userId = dto.userId;
    like.parentId = dto.parentId;
    like.status = dto.status;

    return like as LikeDocument;
  }

  update(dto: UpdateLikeDto) {
    this.status = dto.likeStatus;
  }

  isSameStatus(status: LikeStatus) {
    return this.status === status;
  }
}

export const LikeSchema = SchemaFactory.createForClass(Like);

// Registers the entity methods in the schema
LikeSchema.loadClass(Like);

// Type of the document
export type LikeDocument = HydratedDocument<Like> & SchemaTimestampsConfig;

// Type of the model + static methods
export type LikeModelType = Model<LikeDocument> & typeof Like;
