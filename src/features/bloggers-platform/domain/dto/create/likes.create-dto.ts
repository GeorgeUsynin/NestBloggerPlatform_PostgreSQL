import { ParentType } from '../../../types';
import { LikeStatus } from '../../like.entity';

export type CreateLikeDto = {
  parentId: number;
  userId: number;
  status: LikeStatus;
  parentType: ParentType;
};
