import { IsOptional, IsString, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateRouteDto } from 'src/routes/dto/update-route.dto';

export class UpdateSchedule {
  @IsOptional()
  @IsString()
  train_number?: string;

  // Якщо масив передано — інтерпретуємо як ПОВНУ заміну stop_times
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateRouteDto)
  stop_times?: UpdateRouteDto[];
}
