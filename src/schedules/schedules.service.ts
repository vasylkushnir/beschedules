import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from './schedule.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Route } from 'src/routes/routes.entity';
import { CreateScheduleWithStopsDto } from './dto/create-schedule.dto';
import { UpdateSchedule } from './dto/update-schedule.dto';
import { SearchSchedulesDto } from './dto/seacrh-schedule.dto';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedule)
    private readonly repo: Repository<Schedule>,
  ) {}

  private toDate(v?: string | null) {
    return v ? new Date(v) : undefined;
  }

  private findAllBaseQuery(): SelectQueryBuilder<Schedule> {
    return this.repo
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.routes', 'r')
      .leftJoinAndSelect('r.stop', 'stop')
      .distinct(true)
      .orderBy('s.id', 'ASC')
      .addOrderBy('r.sequence', 'ASC');
  }

  private applySearchAndFilters(
    qb: SelectQueryBuilder<Schedule>,
    query: SearchSchedulesDto,
  ) {
    if (query.train_number) {
      qb.andWhere('s.train_number ILIKE :tn', {
        tn: `%${query.train_number}%`,
      });
    }
    if (query.type) {
      qb.andWhere('s.type = :tp', { tp: query.type });
    }
    if (query.arrival_at) {
      qb.andWhere('r.arrival_time >= :arrival', {
        arrival: new Date(query.arrival_at),
      });
    }
    if (query.departed_at) {
      qb.andWhere('r.departure_time >= :departed', {
        departed: new Date(query.departed_at),
      });
    }
    if (query.stop_id) {
      qb.andWhere('r.stop_id = :stop_id', { stop_id: query.stop_id });
    }
    if (query.id) {
      qb.andWhere('s.id IN (:...ids)', { ids: query.id });
    }
    return qb;
  }

  async createSchedule(
    dto: CreateScheduleWithStopsDto & { created_by_user_id: number },
  ) {
    return this.repo.manager.transaction(async (em) => {
      const scheduleRepo = em.getRepository(Schedule);
      const stopTimeRepo = em.getRepository(Route);

      // 1) schedule
      const schedule = scheduleRepo.create();
      schedule.train_number = dto.train_number;
      schedule.created_by_user_id = dto.created_by_user_id;
      schedule.updated_by_user_id = dto.created_by_user_id;
      await scheduleRepo.save(schedule);

      // 2) stop_times
      const rows: Route[] = dto.stop_times
        .sort((a, b) => a.sequence - b.sequence)
        .map((i) => {
          const row = stopTimeRepo.create(); // теж без аргументів
          row.schedule_id = schedule.id;
          //row.schedule = schedule; // щоб одразу був зв’язок у відповіді
          row.stop_id = i.stop_id;
          row.sequence = i.sequence;
          row.arrival_time = this.toDate(i.arrival_time);
          row.departure_time = this.toDate(i.departure_time);
          row.created_by_user_id = dto.created_by_user_id;
          row.updated_by_user_id = dto.created_by_user_id;
          return row;
        });

      await stopTimeRepo.save(rows);

      // Повернемо schedule з відсортованими stop_times
      ///schedule.stop_times = rows;
      return schedule;
    });
  }

  updateSchedule(
    id: number,
    dto: UpdateSchedule,
    userId: number,
  ): Promise<Schedule | null> {
    return this.repo.manager.transaction(async (em) => {
      const scheduleRepo = em.getRepository(Schedule);
      const stopTimeRepo = em.getRepository(Route);

      // 1) знайти розклад
      const schedule = await scheduleRepo.findOne({ where: { id } });
      if (!schedule) throw new NotFoundException('Schedule not found');

      // 2) оновити поля розкладу (якщо є)
      if (dto.train_number !== undefined) {
        schedule.train_number = dto.train_number;
      }
      schedule.updated_by_user_id = userId;
      await scheduleRepo.save(schedule);

      // 3) якщо stop_times не передано — повертаємо тільки оновлений schedule
      if (!dto.stop_times) {
        // підвантажимо stop_times для відповіді
        const withRelations = await scheduleRepo
          .createQueryBuilder('s')
          .leftJoinAndSelect('s.stop_times', 'st')
          .leftJoinAndSelect('st.stop', 'stop')
          .where('s.id = :id', { id: schedule.id })
          .orderBy('st.sequence', 'ASC')
          .getOne();

        return withRelations;
      }

      // 5) повна заміна списку stop_times
      await stopTimeRepo.delete({ schedule_id: schedule.id });

      const rows: Route[] = dto.stop_times
        .sort((a, b) => a.sequence - b.sequence)
        .map((i) => {
          const row = stopTimeRepo.create(); // уникаємо проблем з перевантаженням create()
          row.schedule_id = schedule.id;
          row.schedule = schedule; // для зручного повернення
          row.stop_id = i.stop_id;
          row.sequence = i.sequence;
          row.arrival_time = this.toDate(i.arrival_time);
          row.departure_time = this.toDate(i.departure_time);
          row.created_by_user_id = userId;
          row.updated_by_user_id = userId;
          return row;
        });

      await stopTimeRepo.save(rows);

      return schedule;
    });
  }

  async findAll(query: SearchSchedulesDto) {
    const qb = this.findAllBaseQuery().limit(query.limit).take(query.skip);
    this.applySearchAndFilters(qb, query);
    const [data, total] = await qb.getManyAndCount();
    return { data, skip: query.skip, limit: query.limit, total };
  }

  async findOne(id: number) {
    const schedule = await this.findAllBaseQuery()
      .where('s.id = :id', { id })
      .getOne();

    if (!schedule) throw new NotFoundException('Schedule not found');
    return schedule;
  }

  async remove(id: number) {
    const res = await this.repo.delete(id);
    if (!res.affected) throw new NotFoundException('Schedule not found');
    return { ok: true };
  }
}
