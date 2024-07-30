import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';
const options = { _id: 0, userId: 0 };
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    if (
      createUserDto.DeviceId &&
      this.checkDeviceIdExists(createUserDto.DeviceId)
    ) {
      throw new ConflictException('Device ID already exists');
    }
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(createUserDto.Password, salt);
    createUserDto.Password = hash;

    try {
      const createdUser = new this.userModel(createUserDto);
      return await createdUser.save();
    } catch (error) {
      if (error.code === 11000) {
        // Mongoose duplicate key error code
        if (error.keyPattern?.Email) {
          throw new ConflictException('Email already exists');
        }
      }
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async findAll(): Promise<User[]> {
    const users = await this.userModel.find({}, options).exec();
    return users as User[];
  }

  async findByEmail(email: string): Promise<User | null> {
    const query = { Email: email };
    const user = await this.userModel.findOne(query, options).exec();
    return user as User | null;
  }

  async update(
    email: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User | null> {
    const query = { Email: email };

    if (updateUserDto.DeviceId === undefined) {
      delete updateUserDto.DeviceId;
    }
    if (
      updateUserDto.DeviceId &&
      this.checkDeviceIdExists(updateUserDto.DeviceId)
    ) {
      throw new ConflictException('Device ID already exists');
    }
    try {
      const updatedUser = await this.userModel
        .findOneAndUpdate(query, updateUserDto, { new: true })
        .exec();
      if (!updatedUser) {
        throw new ConflictException('User not found');
      }
      return updatedUser as User | null;
    } catch (error) {
      if (error.code === 11000) {
        // Mongoose duplicate key error code
        if (error.keyPattern.Email) {
          throw new ConflictException('Email already exists');
        }
      }
      throw error;
    }
  }

  async remove(email: string): Promise<{ deletedCount?: number }> {
    const result = await this.userModel.deleteOne({ Email: email }).exec();
    return result;
  }

  async validateUser(email: string, password: string): Promise<boolean> {
    const user: User = await this.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.Password))) {
      if (user.DeviceId && this.checkDeviceIdExists(user.DeviceId)) {
        user.Lastlogin = Date.now();
        await this.update(user.Email, user);
        return true;
      }
    }
    return false;
  }
  private async checkDeviceIdExists(id: string): Promise<boolean> {
    if (!id) return false;
    const query = { DeviceId: id };
    const quantity = await this.userModel.find(query).countDocuments();
    return quantity > 0;
  }
}
