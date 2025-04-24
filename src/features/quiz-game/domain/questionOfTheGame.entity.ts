import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Question } from './question.entity';
import { Game } from './game.entity';

@Entity({ name: 'QuestionsOfTheGame' })
export class QuestionOfTheGame {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  questionId: number;

  @Column({ type: 'integer' })
  gameId: number;

  @Column({ type: 'integer' })
  questionIndex: number;

  /**
   * RELATIONS
   */

  @OneToOne(() => Question, (question) => question.questionOfTheGame, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'questionId' })
  question: Question;

  @ManyToOne(() => Game, (game) => game.questionsOfTheGame, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'gameId' })
  game: Game;
}
