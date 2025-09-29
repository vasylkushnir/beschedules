import { Module } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { RoutesController } from './routes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from 'src/schedules/schedule.entity';
import { Stop } from 'src/stops/stop.entity';
import { Route } from './routes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Route, Schedule, Stop])],
  controllers: [RoutesController],
  providers: [RoutesService],
  exports: [RoutesService],
})
export class RoutesModule {}
