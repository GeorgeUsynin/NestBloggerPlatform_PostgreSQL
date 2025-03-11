import { Injectable } from '@nestjs/common';
import {
  DeletionStatus,
  Post,
  PostDocument,
  PostModelType,
} from '../domain/post.entity';
import { InjectModel } from '@nestjs/mongoose';
import { NotFoundDomainException } from '../../../core/exceptions/domain-exceptions';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel(Post.name)
    private PostModel: PostModelType,
  ) {}

  async findPostByIdOrNotFoundFail(id: string) {
    const post = await this.PostModel.findOne({
      _id: id,
      deletionStatus: { $ne: DeletionStatus.PermanentDeleted },
    });
    if (!post) {
      throw NotFoundDomainException.create('Post not found');
    }
    return post;
  }

  async save(post: PostDocument) {
    return post.save();
  }
}
