import { Injectable } from '@nestjs/common';
import { NotFoundDomainException } from '../../../core/exceptions/domain-exceptions';
import { CreateCommentDto } from '../domain/dto/create/comments.create-dto';
import { DBComment } from './types';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UpdateCommentDto } from '../domain/dto/update/comments.update-dto';

@Injectable()
export class CommentsRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async createComment(dto: CreateCommentDto): Promise<DBComment['id']> {
    const { content, postId, userId } = dto;

    const query = `
        INSERT INTO "Comments"
        ("userId", "postId", content)
        VALUES ($1, $2, $3)
        RETURNING id;
        `;

    const { id } = (
      await this.dataSource.query(query, [userId, postId, content])
    )[0];

    return id;
  }

  async findCommentByIdOrNotFoundFail(id: number): Promise<DBComment> {
    const comment =
      (
        await this.dataSource.query(
          `
      SELECT * FROM "Comments"
      WHERE id = $1 AND "deletedAt" IS NULL;
      `,
          [id],
        )
      )[0] ?? null;

    if (!comment) {
      throw NotFoundDomainException.create('Comment not found');
    }

    return comment;
  }

  async deleteCommentById(commentId: number) {
    return this.dataSource.query(
      `
      UPDATE "Comments"
	    SET "deletedAt" = $1
	    WHERE id = $2;
      `,
      [new Date(), commentId],
    );
  }

  async update(commentId: number, dto: UpdateCommentDto) {
    const { content } = dto;

    return this.dataSource.query(
      `
      UPDATE "Comments"
	    SET "content" = $1
	    WHERE id = $2;
      `,
      [content, commentId],
    );
  }
}
