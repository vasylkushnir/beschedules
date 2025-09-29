import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { FavoriteSchedulesService } from './favorite-schedules.service';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { CreateFavoriteDto } from './dto/create-favorite-schedule.dto';
import { SearchSchedulesDto } from 'src/schedules/dto/seacrh-schedule.dto';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/users/user.entity';

@Roles(Role.Admin, Role.User)
@Controller('favorites')
export class FavoriteSchedulesController {
  constructor(private readonly service: FavoriteSchedulesService) {}
  @Post()
  create(@Body() dto: CreateFavoriteDto, @CurrentUser('id') userId: number) {
    return this.service.create(userId, dto.schedule_id);
  }

  @Get()
  getAll(
    @Query() query: SearchSchedulesDto,
    @CurrentUser('id') userId: number,
  ) {
    return this.service.getAll(userId, query);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
  ) {
    return this.service.remove(userId, id);
  }
}
