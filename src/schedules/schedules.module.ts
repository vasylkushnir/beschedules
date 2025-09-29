import { Module } from '@nestjs/common';
import { SchedulesController } from './schedules.controller';
import { SchedulesService } from './schedules.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from './schedule.entity';
import { Stop } from 'src/stops/stop.entity';
import { Route } from 'src/routes/routes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Schedule, Stop, Route])],
  controllers: [SchedulesController],
  providers: [SchedulesService],
  exports: [SchedulesService],
})
export class SchedulesModule {}
