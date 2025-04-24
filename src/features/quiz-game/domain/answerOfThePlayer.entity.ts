import { User } from '../../user-accounts/domain/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Game } from './game.entity';
import { PlayerProgress } from './playerProgress.entity';

@Entity({ name: 'AnswersOfThePlayers' })
export class AnswerOfThePlayer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  body: string;

  @Column({ type: 'integer' })
  userId: number;

  @Column({ type: 'integer' })
  gameId: number;

  @Column({ type: 'integer' })
  answerIndex: number;

  @Column({ type: 'boolean' })
  isCorrect: boolean;

  @Column({ type: 'integer' })
  playerProgressId: number;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  /**
   * RELATIONS
   */

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Game, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'gameId' })
  game: Game;

  @ManyToOne(
    () => PlayerProgress,
    (playerProgress) => playerProgress.answersOfThePlayer,
  )
  @JoinColumn({ name: 'playerProgressId' })
  playerProgress: PlayerProgress;
}
