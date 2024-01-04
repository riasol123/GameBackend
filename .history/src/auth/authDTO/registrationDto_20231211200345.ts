import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class RegistrationDto { 
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  readonly email: string;
}