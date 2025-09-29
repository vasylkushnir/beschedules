import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from 'src/schedules/schedule.entity';
import { FavoriteSchedule } from './favorite-schedules.entity';
import { Repository } from 'typeorm';
import { SearchSchedulesDto } from 'src/schedules/dto/seacrh-schedule.dto';
import { SchedulesService } from 'src/schedules/schedules.service';

@Injectable()
export class FavoriteSchedulesService {
  constructor(
    @InjectRepository(FavoriteSchedule)
    private readonly repo: Repository<FavoriteSchedule>,
    @InjectRepository(Schedule)
    private readonly schedules: Repository<Schedule>,
    private readonly schedulesService: SchedulesService,
  ) {}

  async create(userId: number, schedule_id: number) {
    const exists = await this.schedules.findOne({ where: { id: schedule_id } });
    if (!exists) throw new NotFoundException('Schedule not found');

    console.log(exists);

    const favorite = this.repo.create({ user_id: userId, schedule_id });
    return await this.repo.save(favorite);
  }

  async remove(userId: number, schedule_id: number) {
    const res = await this.repo.delete({ user_id: userId, schedule_id });
    if (!res.affected) throw new NotFoundException('Favorite not found');
    return {};
  }
  async getAll(userId: number, query: SearchSchedulesDto) {
    const favoriteSchedules = await this.repo.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
      select: { schedule_id: true },
      loadEagerRelations: false,
    });

    const favoriteScheduleIds = favoriteSchedules.map(
      (schedule) => schedule.schedule_id,
    );

    return await this.schedulesService.findAll({
      ...query,
      id: favoriteScheduleIds,
    });
  }
}
