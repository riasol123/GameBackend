import { IsNotEmpty } from 'class-validator';

export class ProgressDto {
  @IsNotEmpty({message: 'invalid'})
  progress: number;
}
