import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { CreateScheduleWithStopsDto as CreateScheduleDto } from './dto/create-schedule.dto';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { UpdateSchedule as UpdateScheduleDto } from './dto/update-schedule.dto';
import { SearchSchedulesDto } from './dto/seacrh-schedule.dto';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/users/user.entity';

@Controller('schedules')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class SchedulesController {
  constructor(private readonly service: SchedulesService) {}

  @Roles(Role.Admin, Role.User)
  @Get()
  getAll(@Query() query: SearchSchedulesDto) {
    return this.service.findAll(query);
  }
  @Roles(Role.Admin)
  @Post()
  create(@Body() dto: CreateScheduleDto, @CurrentUser('id') userId: number) {
    return this.service.createSchedule({
      ...dto,
      created_by_user_id: userId,
    });
  }

  @Roles(Role.Admin)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateScheduleDto,
    @CurrentUser('id') userId: number,
  ) {
    return this.service.updateSchedule(id, dto, userId);
  }

  @Roles(Role.Admin, Role.User)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
