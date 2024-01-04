import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

import { AuthModule } from './auth/auth.module';
import { User } from '../models/user';
import { CustomJwtModule } from './customJWT/customJwtModule';
import { AdminController } from './admin/admin.controller';
import { AdminService } from './admin/admin.service';
import { AdminModule } from './admin/admin.module';
import { UserTask } from 'models/usertask';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: 'univer', 
      password: 'univer',
      database: 'univer',
      models: [User, UserTask, User],
    }),
    AuthModule,
    CustomJwtModule,
    AdminModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AppModule {}
