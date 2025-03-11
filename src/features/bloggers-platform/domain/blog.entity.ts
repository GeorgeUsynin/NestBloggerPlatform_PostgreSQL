import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, SchemaTimestampsConfig } from 'mongoose';
import { CreateBlogDto } from './dto/create/blogs.create-dto';
import { UpdateBlogDto } from './dto/update/blogs.update-dto';

export enum DeletionStatus {
  NotDeleted = 'not-deleted',
  PermanentDeleted = 'permanent-deleted',
}

export const websiteUrlConstraints = {
  maxLength: 100,
  match: /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
};

export const nameConstraints = {
  maxLength: 15,
};

export const descriptionConstraints = {
  maxLength: 500,
};

export // The timestamp flag automatically adds the updatedAt and createdAt fields


@Schema({ timestamps: true })
class Blog {
  @Prop({ type: String, required: true, ...nameConstraints })
  name: string;

  @Prop({ type: String, required: true, ...descriptionConstraints })
  description: string;

  @Prop({ type: Boolean, default: false })
  isMembership: boolean;

  @Prop({
    type: String,
    required: true,
    ...websiteUrlConstraints,
  })
  websiteUrl: string;

  @Prop({ enum: DeletionStatus, default: DeletionStatus.NotDeleted })
  deletionStatus: DeletionStatus;

  static createBlog(dto: CreateBlogDto): BlogDocument {
    // BlogDocument!
    const blog = new this(); //this will be a BlogModel when we will call createBlog method!

    blog.name = dto.name;
    blog.description = dto.description;
    blog.websiteUrl = dto.websiteUrl;

    return blog as BlogDocument;
  }

  makeDeleted() {
    if (this.deletionStatus !== DeletionStatus.NotDeleted) {
      throw new Error('Entity already deleted');
    }
    this.deletionStatus = DeletionStatus.PermanentDeleted;
  }

  update(dto: UpdateBlogDto) {
    this.name = dto.name;
    this.description = dto.description;
    this.websiteUrl = dto.websiteUrl;
  }
}

export const BlogSchema = SchemaFactory.createForClass(Blog);

// Registers the entity methods in the schema
BlogSchema.loadClass(Blog);

// Type of the document
export type BlogDocument = HydratedDocument<Blog> & SchemaTimestampsConfig;

// Type of the model + static methods
export type BlogModelType = Model<BlogDocument> & typeof Blog;
