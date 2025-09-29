import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class SearchSchedulesDto {
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => Number)
  @IsInt({ each: true })
  @Min(1, { each: true })
  id?: number[];

  @IsOptional()
  @IsString()
  train_number?: string;

  @IsOptional()
  @IsString()
  type?: string; // наприклад, intercity, regional, fast

  @IsOptional()
  @IsDateString()
  arrival_at?: string; // шукаємо розклади, що прибувають у цю дату/час

  @IsOptional()
  @IsDateString()
  departed_at?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  stop_id?: number; // stop_id

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip = 0;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit = 10;
}
