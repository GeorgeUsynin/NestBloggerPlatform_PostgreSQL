import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'EmailConfirmations' })
export class EmailConfirmation {
  // Первичный ключ, он же является внешним к таблице EmailConfirmation
  @PrimaryColumn({ type: 'integer' })
  userId: number;

  @Column({ type: 'boolean', default: false })
  isConfirmed: boolean;

  @Column({ type: 'timestamp with time zone', nullable: true })
  expirationDate: Date | null;

  @Column({ type: 'uuid', nullable: true })
  confirmationCode: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  @OneToOne(() => User, (user) => user.emailConfirmation, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;
}
