import { IsInt, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchStopsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  skip: number = 0;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 10;
}
