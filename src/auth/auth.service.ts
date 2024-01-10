import {
  BadRequestException,
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
import * as jwt from 'jsonwebtoken';
import { RegistrationDto } from './authDTO/registration.dto';
import { LoginDto } from './authDTO/login.dto';
import { WhoAmIDto } from './authDTO/whoAmI.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private readonly userRepository: typeof User,
    private readonly jwtService: JwtService,
  ) {}

  private generateToken(id: number) {
    return this.jwtService.signAsync({ id });
  }

  async getUserProgress(data: WhoAmIDto) {
    const { id } = this.decodeToken(data.id);
    const obj = await this.userRepository.findOne({
      where: { id },
      attributes: ['progress'],
    });
    return obj.progress;
  }

  async login(data: LoginDto) {
    try {
    const user = await this.validateUser(data);
    delete user.password;
    const token = await this.generateToken(user.id);
    return token;
    } catch(e) {
      throw new BadRequestException({
        message: e.message,
      });
    }
  }

  async registration(data: RegistrationDto) {
    const candidateEmail = await this.userRepository.findOne({
      where: { email: data.email },
    });

    if (candidateEmail) {
      throw new HttpException(
        errorMessages.USER_EXIST_ERROR,
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.userRepository.create(data);
    const token = await this.generateToken(user.id);
    return token;
  }

  async validateUser(data: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: data.email },
    });

    if (!user) {
      throw new UnauthorizedException({
        message: errorMessages.USER_NOT_FOUND,
      });
    }

    const isPasswordEquals = await bcrypt.compare(data.password, user.password);
    if (!isPasswordEquals) {
      throw new UnauthorizedException({
        message: errorMessages.USER_INCORRECT_PASSWORD,
      });
    }
    return user;
  }

  decodeToken(token: string): any {
    try {
      const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
      return decoded;
    } catch (error) {
      console.error('Error decoding token:', error.message);
      throw new Error('Invalid token');
    }
  }

  async score(value: number, token: string) {
    const { id } = this.decodeToken(token);
    await this.userRepository.update({progress: value}, {
      where: { id },
    });
  }
}
