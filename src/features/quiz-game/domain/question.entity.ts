import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
} from 'typeorm';
import { QuestionOfTheGame } from './questionOfTheGame.entity';

@Entity({ name: 'Questions' })
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  body: string;

  @Column('text', { array: true })
  correctAnswers: string[];

  @Column({ type: 'boolean', default: false })
  isPublished: boolean;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp with time zone', nullable: true })
  deletedAt: Date | null;

  /**
   * RELATIONS
   */

  @OneToOne(
    () => QuestionOfTheGame,
    (questionOfTheGame) => questionOfTheGame.question,
  )
  questionOfTheGame: QuestionOfTheGame;
}
