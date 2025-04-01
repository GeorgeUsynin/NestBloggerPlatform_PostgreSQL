import { Entity, Column, JoinColumn, PrimaryColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'AuthDeviceSessions' })
export class AuthDeviceSession {
  @PrimaryColumn({ type: 'uuid' })
  deviceId: string;

  @Column({ type: 'timestamp with time zone' })
  issuedAt: Date;

  @Column({ type: 'varchar' })
  deviceName: string;

  @Column({ type: 'varchar' })
  clientIp: string;

  @Column({ type: 'timestamp with time zone' })
  expirationDateOfRefreshToken: Date;

  @Column({ type: 'integer' })
  userId: number;

  @ManyToOne(() => User, (user) => user.authDeviceSession, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;
}
