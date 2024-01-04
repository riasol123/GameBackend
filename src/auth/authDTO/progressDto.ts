import { IsNotEmpty } from 'class-validator';

export class ProgressDto {
  @IsNotEmpty()
  progress: number;
}
