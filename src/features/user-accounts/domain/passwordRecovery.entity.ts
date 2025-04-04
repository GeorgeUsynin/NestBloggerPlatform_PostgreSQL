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

@Entity({ name: 'PasswordRecoveries' })
export class PasswordRecovery {
  @PrimaryColumn({ type: 'integer' })
  userId: number;

  @Column({ type: 'timestamp with time zone' })
  expirationDate: Date;

  @Column({ type: 'uuid' })
  recoveryCode: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  @OneToOne(() => User, (user) => user.passwordRecovery, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;
}
