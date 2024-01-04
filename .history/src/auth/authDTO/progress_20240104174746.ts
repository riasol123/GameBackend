import { IsNotEmpty } from 'class-validator';

export class Progress {
  @IsNotEmpty()
  readonly id: number;
}
