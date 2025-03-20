import { LikeStatus, ParentType } from '../types';

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
