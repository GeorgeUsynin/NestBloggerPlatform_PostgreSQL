import { Injectable } from '@nestjs/common';
import { NotFoundDomainException } from '../../../core/exceptions/domain-exceptions';
import { CreateCommentDto } from '../domain/dto/create/comments.create-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from '../domain/comment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
  ) {}

  create(dto: CreateCommentDto) {
    return this.commentsRepository.create(dto);
  }

  async save(comment: Comment) {
    return this.commentsRepository.save(comment);
  }

  async deleteAllComments() {
    return this.commentsRepository.delete({});
  }

  async findCommentByIdOrNotFoundFail(id: number): Promise<Comment> {
    const comment = await this.commentsRepository.findOneBy({ id });

    if (!comment) {
      throw NotFoundDomainException.create('Comment not found');
    }

    return comment;
  }

  async softDeleteCommentById(id: number) {
    return this.commentsRepository.softDelete(id);
  }
}
