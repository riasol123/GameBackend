import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'models/user';
import { errorMessages } from 'src/errorMessages/errorMessages';

import { RegistrationDto } from './authDTO/registrationDto';
import { LoginDto } from './authDTO/loginDto';
import { whoAmIDto } from './authDTO/whoAmIDto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private readonly userRepo: typeof User,
    private readonly jwtService: JwtService,
  ) {}

  private generateToken(id: number) {
    return this.jwtService.signAsync({ id });
  }

  async getUserInfo(data: whoAmIDto) {
    return await this.userRepo.findOne({
      where: { id: data.id },
      attributes: ['progress'],
    });
  }

  async login(data: LoginDto) {
    const user = await this.validateUser(data);
    delete user.password;
    const token = await this.generateToken(user.id);
    return { token };
  }

  async registration(data: RegistrationDto) {
    console.log(data);
    const candidateEmail = await this.userRepo.findOne({
      where: { email: data.email },
    });

    if (candidateEmail) {
      throw new HttpException(
        errorMessages.USER_EXIST_ERROR,
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.userRepo.create(data);
    const token = await this.generateToken(user.id);
    return { token };
  }

  async validateUser(data: LoginDto) {
    const user = await this.userRepo.findOne({
      where: { email: data.email },
    });

    console.log(user);

    if (!user) {
      throw new UnauthorizedException({
        message: errorMessages.USER_NOT_FOUND,
      });
    }

    const isPasswordEquals = await bcrypt.compare(data.password, user.password);
    console.log(isPasswordEquals);

    if (!isPasswordEquals) {
      throw new UnauthorizedException({
        message: errorMessages.USER_INCORRECT_PASSWORD,
      });
    }
    return user;
  }

  score(
    task: Partial<User>,
    id: number,
  ): Promise<[affectedCount: number, affectedRows: Task[]] | never> {
    return this.taskRepository
      .update(task, { where: { id: id }, returning: true })
      .then(
        (response) =>
          new Promise((resolve) => {
            if (response[0] !== 0) resolve(response);
            else throw new HttpException('Not found', HttpStatus.NOT_FOUND);
          }),
      );
  }
}
