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
  @Prop({ type: Number, required: true })
  userId: number;

  @Prop({ type: String, required: true })
  parentId: string;

  @Prop({ type: String, enum: LikeStatus, required: true })
  status: LikeStatus;

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
