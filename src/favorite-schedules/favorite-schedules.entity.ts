import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  Unique,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Schedule } from '../schedules/schedule.entity';

@Entity('favorite_schedules')
@Unique(['user_id', 'schedule_id'])
export class FavoriteSchedule {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Index()
  @Column({ type: 'int', name: 'user_id' })
  user_id: number;

  @ManyToOne(() => Schedule, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'schedule_id' })
  schedule: Schedule;

  @Index()
  @Column({ type: 'int', name: 'schedule_id' })
  schedule_id: number;

  @CreateDateColumn({
    type: 'timestamptz',
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;
}
