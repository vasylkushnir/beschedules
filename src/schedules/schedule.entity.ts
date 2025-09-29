import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { Route } from 'src/routes/routes.entity';
import { Exclude } from 'class-transformer';

export enum TrainType {
  REGIONAL = 'regional',
  REGIONAL_EXPRESS = 'regional_express',
  NIGHT_EXPRESS = 'night_express',
  NIGHT_FAST = 'night_fast',
  NIGHT_PASSENGER = 'night_passenger',
}

@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Index()
  @Column({ type: 'varchar', name: 'train_number' })
  train_number: string;

  @Column({
    type: 'enum',
    enum: TrainType,
    default: TrainType.NIGHT_FAST,
  })
  type: TrainType;

  @OneToMany(() => Route, (r) => r.schedule, { cascade: false })
  routes: Route[];

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
