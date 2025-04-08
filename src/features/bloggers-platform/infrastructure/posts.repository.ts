import { Injectable } from '@nestjs/common';
import { NotFoundDomainException } from '../../../core/exceptions/domain-exceptions';
import { CreatePostDto } from '../domain/dto/create/posts.create-dto';
import { Post } from '../domain/post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async create(dto: CreatePostDto) {
    return this.postsRepository.create(dto);
  }

  async findPostByIdOrNotFoundFail(id: number) {
    const post = await this.postsRepository.findOneBy({ id });

    if (!post) {
      throw NotFoundDomainException.create('Post not found');
    }

    return post;
  }

  async softDeletePostById(id: number) {
    return this.postsRepository.softDelete(id);
  }

  async deleteAllPosts() {
    return this.postsRepository.delete({});
  }

  async save(post: Post) {
    return this.postsRepository.save(post);
  }
}
