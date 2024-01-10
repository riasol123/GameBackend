import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => value.trim())
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
