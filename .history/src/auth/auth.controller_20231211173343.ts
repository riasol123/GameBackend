import { Controller } from '@nestjs/common';

@Controller('auth')
export class AuthController {

  @Post('/registration')
  register(
    @Body() 
  ) { 

  }
}
