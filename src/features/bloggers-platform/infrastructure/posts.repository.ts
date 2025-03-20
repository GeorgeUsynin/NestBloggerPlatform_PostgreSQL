import { Injectable } from '@nestjs/common';
import { Post, PostDocument, PostModelType } from '../domain/post.entity';
import { InjectModel } from '@nestjs/mongoose';
import { NotFoundDomainException } from '../../../core/exceptions/domain-exceptions';
import { CreatePostDto } from '../domain/dto/create/posts.create-dto';
import { DBPost } from './types';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UpdatePostDto } from '../domain/dto/update/posts.update-dto';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel(Post.name)
    private PostModel: PostModelType,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async save(post: PostDocument) {
    return post.save();
  }

  // POSTGRES

  async createPost(dto: CreatePostDto): Promise<DBPost['id']> {
    const { blogId, blogName, content, shortDescription, title } = dto;

    const query = `
    INSERT INTO "Posts"
    (title, "shortDescription", content, "blogId", "blogName")
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id;
    `;

    const { id } = (
      await this.dataSource.query(query, [
        title,
        shortDescription,
        content,
        blogId,
        blogName,
      ])
    )[0];

    return id;
  }

  async findPostByIdOrNotFoundFail(id: number) {
    const post =
      (
        await this.dataSource.query(
          `
    SELECT * FROM "Posts"
    WHERE id = $1 AND "deletedAt" IS NULL;
    `,
          [id],
        )
      )[0] ?? null;

    if (!post) {
      throw NotFoundDomainException.create('Post not found');
    }

    return post;
  }

  async update(postId: number, dto: UpdatePostDto) {
    const { blogId, content, shortDescription, title } = dto;

    return this.dataSource.query(
      `
        UPDATE "Posts"
        SET content = $1, "shortDescription" = $2, title = $3, "blogId" = $4 
        WHERE id = $5 AND "deletedAt" IS NULL;
        `,
      [content, shortDescription, title, Number(blogId), postId],
    );
  }

  async deletePostById(postId: number) {
    return this.dataSource.query(
      `
      UPDATE "Posts"
	    SET "deletedAt" = $1
	    WHERE id = $2;
      `,
      [new Date(), postId],
    );
  }
}
