import { Injectable } from '@nestjs/common';
import { Like, LikeDocument, LikeModelType } from '../domain/like.entity';
import { InjectModel } from '@nestjs/mongoose';

type TParams = {
  parentId?: string;
  userId?: number;
};

@Injectable()
export class LikesRepository {
  constructor(
    @InjectModel(Like.name)
    private LikeModel: LikeModelType,
  ) {}

  async findLikeByParams(params: TParams) {
    return this.LikeModel.findOne(params);
  }

  async save(likeDocument: LikeDocument) {
    return likeDocument.save();
  }
}
