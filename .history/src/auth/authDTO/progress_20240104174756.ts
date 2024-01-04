import { IsNotEmpty } from 'class-validator';

export class Progress {
  @IsNotEmpty()
   id: number;
}
