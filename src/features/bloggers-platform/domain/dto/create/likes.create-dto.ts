import { LikeStatus } from '../../like.entity';

export type CreateLikeDto = {
  parentId: string;
  userId: number;
  status: LikeStatus;
};
