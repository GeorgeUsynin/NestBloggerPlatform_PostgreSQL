import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, SchemaTimestampsConfig } from 'mongoose';
import { Likeable } from './shared.entity';

export enum DeletionStatus {
  NotDeleted = 'not-deleted',
  PermanentDeleted = 'permanent-deleted',
}

export const titleConstraints = {
  maxLength: 30,
};

export const shortDescriptionConstraints = {
  maxLength: 100,
};

export const contentConstraints = {
  maxLength: 1000,
};

// The timestamp flag automatically adds the updatedAt and createdAt fields
@Schema({ timestamps: true })
export class Post extends Likeable {
  @Prop({ type: String, required: true, ...titleConstraints })
  title: string;

  @Prop({ type: String, required: true, ...shortDescriptionConstraints })
  shortDescription: string;

  @Prop({
    type: String,
    required: true,
    ...contentConstraints,
  })
  content: string;

  @Prop({ type: String, required: true })
  blogId: string;

  @Prop({ type: String, required: true })
  blogName: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);

// Registers the entity methods in the schema
PostSchema.loadClass(Post);

// Type of the document
export type PostDocument = HydratedDocument<Post> & SchemaTimestampsConfig;

// Type of the model + static methods
export type PostModelType = Model<PostDocument> & typeof Post;
