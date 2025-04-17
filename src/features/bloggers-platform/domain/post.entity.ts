import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import {
  postContentConstraints,
  shortDescriptionConstraints,
  titleConstraints,
} from '../api/dto/constraints';
import { Blog } from './blog.entity';
@Entity({ name: 'Posts' })
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: titleConstraints.maxLength })
  title: string;

  @Column({ type: 'varchar', length: shortDescriptionConstraints.maxLength })
  shortDescription: string;

  @Column({ type: 'varchar', length: postContentConstraints.maxLength })
  content: string;

  @Column({ type: 'varchar' })
  blogName: string;

  @Index()
  @Column({ type: 'integer' })
  blogId: number;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp with time zone', nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => Blog, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'blogId' })
  blog: Blog;
}
