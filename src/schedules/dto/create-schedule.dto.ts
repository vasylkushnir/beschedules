import {
  IsString,
  ValidateNested,
  ArrayMinSize,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateRouteDto } from 'src/routes/dto/create-route.dto';

export class CreateScheduleWithStopsDto {
  @IsString()
  train_number: string;

  @IsArray()
  @ArrayMinSize(2)
  @ValidateNested({ each: true })
  @Type(() => CreateRouteDto)
  stop_times: CreateRouteDto[];
}
