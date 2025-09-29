import { IsOptional, IsString } from 'class-validator';

export class CreateStopDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  country?: string;
}
