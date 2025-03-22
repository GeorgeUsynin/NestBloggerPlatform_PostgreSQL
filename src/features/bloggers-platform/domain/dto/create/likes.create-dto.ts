import { LikeStatus } from '../../like.entity';

export type CreateLikeDto = {
  parentId: number;
  userId: number;
  status: LikeStatus;
};
