import { IsEmail, IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name should not be empty' })
  @IsString({ message: 'Name must be a string' })
  Name: string;

  @IsNotEmpty({ message: 'Email should not be empty' })
  @IsEmail({}, { message: 'Email must be an email' })
  Email: string;

  @IsNotEmpty({ message: 'Password should not be empty' })
  @IsString({ message: 'Password must be a string' })
  Password: string;

  @IsOptional()
  @IsString({ message: 'DeviceId must be a string' })
  DeviceId: string | null;

  @IsOptional()
  @IsNumber({}, { message: 'Lastlogin must be a number' })
  Lastlogin: number | null;

  @IsOptional()
  @IsNumber({}, { message: 'Status must be a number' })
  Status: number | null;
}
