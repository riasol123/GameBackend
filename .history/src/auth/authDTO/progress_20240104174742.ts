import { IsNotEmpty } from 'class-validator';

export class p {
  @IsNotEmpty()
  readonly id: number;
}
