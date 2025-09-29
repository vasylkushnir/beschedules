import { IsString } from 'class-validator';

export class UpdateStopDto {
  @IsString()
  name: string;
}
