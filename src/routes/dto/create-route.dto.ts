// src/schedules/dto/create-stop-time-inline.dto.ts
import { Type } from 'class-transformer';
import { IsInt, Min, IsOptional, IsISO8601 } from 'class-validator';

export class CreateRouteDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  stop_id: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  sequence: number;

  @IsOptional()
  @IsISO8601()
  arrival_time?: string;

  @IsOptional()
  @IsISO8601()
  departure_time?: string;
}
