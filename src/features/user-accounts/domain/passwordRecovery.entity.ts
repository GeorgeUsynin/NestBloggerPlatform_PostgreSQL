import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  PrimaryColumn,
  DeleteDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'PasswordRecoveries' })
export class PasswordRecovery {
  // Первичный ключ, он же является внешним к таблице EmailConfirmation
  @PrimaryColumn({ type: 'integer' })
  userId: number;

  @Column({ type: 'time with time zone' })
  expirationDate: Date | null;

  @Column({ type: 'uuid' })
  recoveryCode: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp with time zone', nullable: true })
  deletedAt: Date | null;

  @OneToOne(() => User, (user) => user.passwordRecovery, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;
}
