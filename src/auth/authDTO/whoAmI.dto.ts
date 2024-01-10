import { IsNotEmpty } from 'class-validator';

export class WhoAmIDto {
  @IsNotEmpty({message: 'invalid'})
  readonly id: string;
}
