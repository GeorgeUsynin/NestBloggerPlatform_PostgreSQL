import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PlayerProgress } from './playerProgress.entity';
import { QuestionOfTheGame } from './questionOfTheGame.entity';

export enum GameStatus {
  ACTIVE = 'active',
  FINISHED = 'finished',
  PENDING = 'pending',
}

@Entity({ name: 'Games' })
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: GameStatus })
  gameStatus: GameStatus;

  @Column({ type: 'timestamp with time zone', nullable: true })
  startedAt: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  finishedAt: Date;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  /**
   * RELATIONS
   */

  @OneToMany(() => PlayerProgress, (playerProgress) => playerProgress.game)
  playersProgresses: PlayerProgress[];

  @OneToMany(
    () => QuestionOfTheGame,
    (questionOfTheGame) => questionOfTheGame.game,
  )
  questionsOfTheGame: QuestionOfTheGame[];
}
