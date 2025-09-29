import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateStopDto } from './dto/create-stop.dto';
import { StopsService } from './stops.service';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/users/user.entity';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { UpdateStopDto } from './dto/update-stop.dto';
import { ParseIntPipe } from '@nestjs/common';
import { SearchStopsDto } from 'src/stops/dto/search-stops.dto';

@Roles(Role.Admin)
@Controller('stops')
export class StopsController {
  constructor(private readonly service: StopsService) {}

  @Post()
  create(@Body() dto: CreateStopDto, @CurrentUser('id') userId: number) {
    return this.service.create({ ...dto, created_by_user_id: userId });
  }

  @Get()
  getAll(@Query() query: SearchStopsDto) {
    return this.service.getAll(query);
  }

  @Get(':id')
  get(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStopDto,
    @CurrentUser('id') userId: number,
  ) {
    return this.service.update(id, { ...dto, updated_by_user_id: userId });
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
