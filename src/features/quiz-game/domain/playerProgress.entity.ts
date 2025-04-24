import {
  Entity,
  JoinColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  OneToMany,
} from 'typeorm';
import { Game } from './game.entity';
import { User } from '../../user-accounts/domain/user.entity';
import { AnswerOfThePlayer } from './answerOfThePlayer.entity';

export enum GameResult {
  WIN = 'win',
  LOSE = 'lose',
  DRAW = 'draw',
}

@Entity({ name: 'PlayersProgresses' })
export class PlayerProgress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  userId: number;

  @Column({ type: 'integer' })
  gameId: number;

  @Column({ type: 'timestamp with time zone', nullable: true })
  finishedAt: Date;

  @Column({ type: 'enum', enum: GameResult, nullable: true })
  gameResult: GameResult;

  @Column({ type: 'integer', nullable: true })
  totalScore: number;

  /**
   * RELATIONS
   */

  @ManyToOne(() => User, (playerAccount) => playerAccount.playerProgress, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  playerAccount: User;

  @ManyToOne(() => Game, (game) => game.playersProgresses, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'gameId' })
  game: Game;

  @OneToMany(
    () => AnswerOfThePlayer,
    (answerOfThePlayer) => answerOfThePlayer.playerProgress,
  )
  answersOfThePlayer: AnswerOfThePlayer[];
}
