import { AllowNull, BeforeCreate, Column, Model, Table } from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';
import { IsNotEmpty, IsEmail } from 'class-validator';

@Table
export class User extends Model<User> {
  @IsNotEmpty()
  @IsEmail()
  @AllowNull(false)
  @Column({unique: true })
  email: string;

  @IsNotEmpty()
  @AllowNull(false)
  @Column
  password: string;

  @Column({ 
    allowNull: true,
    defaultValue: 0,
  })
  progress: number;

  @Column({ allowNull: false })
  createdAt: Date;

  @Column({ allowNull: false })
  updatedAt: Date;

  @BeforeCreate
  static async hashPassword(user: User) {
    user.password = await bcrypt.hash(
      user.password,
      Number(process.env.SALT_ROUNDS),
    );
  }
}
