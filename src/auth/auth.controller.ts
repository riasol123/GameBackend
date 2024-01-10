import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginDto } from './authDTO/login.dto';
import { RegistrationDto } from './authDTO/registration.dto';
import { ProgressDto } from './authDTO/progress.dto';
import { WhoAmIDto } from './authDTO/whoAmI.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/registration')
  register(@Body() registrationData: RegistrationDto) {
    console.log(1)
    return this.authService.registration(registrationData);
  }

  @Post('/login')
  login(@Body() loginData: LoginDto) {
    return this.authService.login(loginData);
  }

  @Get('/whoami/:id')
  whoami(@Param() data: WhoAmIDto) {
    return this.authService.getUserProgress(data);
  }

  @Post('/score/:id')
  score(@Param('id') id: string, @Body() data: ProgressDto) {
    return this.authService.score(data.progress, id);
  }
}
