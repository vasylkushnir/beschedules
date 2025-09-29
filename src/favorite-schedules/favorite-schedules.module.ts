import { Module } from '@nestjs/common';
import { FavoriteSchedulesController } from './favorite-schedules.controller';
import { FavoriteSchedulesService } from './favorite-schedules.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoriteSchedule } from './favorite-schedules.entity';
import { Schedule } from 'src/schedules/schedule.entity';
import { SchedulesService } from 'src/schedules/schedules.service';

@Module({
  imports: [TypeOrmModule.forFeature([FavoriteSchedule, Schedule])],
  controllers: [FavoriteSchedulesController],
  providers: [FavoriteSchedulesService, SchedulesService],
})
export class FavoriteSchedulesModule {}
