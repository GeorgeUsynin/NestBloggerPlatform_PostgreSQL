import { LikeStatus, ParentType } from '../domain/like.entity';

export class DBBlog {
  id: number;
  name: string;
  description: string;
  isMembership: boolean;
  websiteUrl: string;
  deletedAt: Date | null;
  createdAt: Date;
}

export class DBPost {
  id: number;
  title: string;
  shortDescription: string;
  content: string;
  blogId: number;
  blogName: string;
  deletedAt: Date | null;
  createdAt: Date;
}

export class DBLike {
  id: number;
  userId: number;
  parentId: number;
  status: LikeStatus;
  parentType: ParentType;
  createdAt: Date;
}

export class DBComment {
  id: number;
  content: string;
  userId: number;
  postId: string;
  createdAt: Date;
  deletedAt: Date | null;
}
