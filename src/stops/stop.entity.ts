import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Route } from 'src/routes/routes.entity';
import { Exclude } from 'class-transformer';

@Entity('stops')
export class Stop {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Index({ unique: true })
  @Column({ type: 'varchar', name: 'name' })
  name: string;

  @Column({
    type: 'varchar',
    nullable: true,
    default: 'Україна',
    name: 'country',
  })
  country: string;

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

  @OneToMany(() => Route, (st) => st.stop)
  stop_times: Route[];
}
