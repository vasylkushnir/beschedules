import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  Index,
  Unique,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Schedule } from '../schedules/schedule.entity';
import { Stop } from '../stops/stop.entity';
import { Exclude } from 'class-transformer';

@Entity('routes')
@Unique(['schedule', 'sequence'])
export class Route {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ManyToOne(() => Schedule, (s) => s.routes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'schedule_id' })
  @Index()
  schedule: Schedule;

  @Column({ type: 'int', name: 'schedule_id' })
  schedule_id: number;

  @ManyToOne(() => Stop, (st) => st.stop_times, {
    eager: true,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'stop_id' })
  @Index()
  stop: Stop;

  @Column({ type: 'int', name: 'stop_id' })
  stop_id: number;

  @Column({ type: 'int', name: 'sequence' })
  sequence: number;

  @Column({ type: 'timestamptz', nullable: true, name: 'arrival_time' })
  arrival_time?: Date;

  @Column({ type: 'timestamptz', nullable: true, name: 'departure_time' })
  departure_time?: Date;

  // системні колонки
  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'updated_at',
  })
  updated_at: Date;

  @Column({ type: 'int', nullable: true, name: 'created_by_user_id' })
  @Exclude({ toPlainOnly: true })
  created_by_user_id: number;

  @Column({ type: 'int', nullable: true, name: 'updated_by_user_id' })
  @Exclude({ toPlainOnly: true })
  updated_by_user_id: number;
}
