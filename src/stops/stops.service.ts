import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateStopDto } from './dto/create-stop.dto';
import { Stop } from './stop.entity';
import { Repository } from 'typeorm';
import { UpdateStopDto } from './dto/update-stop.dto';
import { SearchStopsDto } from 'src/stops/dto/search-stops.dto';

@Injectable()
export class StopsService {
  constructor(
    @InjectRepository(Stop) private readonly repo: Repository<Stop>,
  ) {}

  async create(dto: CreateStopDto & { created_by_user_id: number }) {
    const entity = this.repo.create(dto);
    return await this.repo.save(entity);
  }

  async getAll(query: SearchStopsDto) {
    const [data, total] = await this.repo.findAndCount({
      skip: query.skip,
      take: query.limit,
      order: { name: 'ASC' },
    });
    return { data, skip: query.skip, limit: query.limit, total };
  }

  async findOne(id: number) {
    const stop = await this.repo.findOne({ where: { id } });
    if (!stop) throw new NotFoundException('Stop not found');
    return stop;
  }

  async update(
    id: number,
    dto: UpdateStopDto & { updated_by_user_id: number },
  ) {
    const stop = await this.findOne(id);
    Object.assign(stop, dto);
    return this.repo.save(stop);
  }

  async remove(id: number) {
    const stop = await this.repo.delete(id);
    if (!stop.affected) throw new NotFoundException('Stop not found');
    return {};
    /**
     * async remove(id: number): Promise<Stop> {
  const res = await this.repo
    .createQueryBuilder()
    .delete()
    .where('id = :id', { id })
    .returning('*')
    .execute();

  const entity = res.raw[0] as Stop | undefined;
  if (!entity) throw new NotFoundException('Stop not found');

  return entity;
     */
  }
}
