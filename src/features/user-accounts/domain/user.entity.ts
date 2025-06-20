import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { EmailConfirmation } from './emailConfirmation.entity';
import { PasswordRecovery } from './passwordRecovery.entity';
import { AuthDeviceSession } from './authDeviceSession.entity';
import { loginConstraints, passwordConstraints } from '../api/dto/constraints';
import { PlayerProgress } from '../../quiz-game/domain/playerProgress.entity';

@Entity({ name: 'Users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: loginConstraints.maxLength, unique: true })
  login: string;

  @Column({
    type: 'varchar',
    length: passwordConstraints.maxLength,
    unique: true,
  })
  email: string;

  @Column({ type: 'varchar' })
  passwordHash: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp with time zone', nullable: true })
  deletedAt: Date | null;

  @OneToOne(
    () => EmailConfirmation,
    (emailConfirmation) => emailConfirmation.user,
  )
  emailConfirmation: EmailConfirmation;

  @OneToOne(() => PasswordRecovery, (passwordRecovery) => passwordRecovery.user)
  passwordRecovery: PasswordRecovery;

  @OneToMany(
    () => AuthDeviceSession,
    (authDeviceSession) => authDeviceSession.user,
  )
  authDeviceSession: AuthDeviceSession[];

  @OneToMany(
    () => PlayerProgress,
    (playerProgress) => playerProgress.playerAccount,
  )
  playerProgress: PlayerProgress[];
}
