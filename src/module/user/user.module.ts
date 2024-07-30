import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import forFeatureDb from 'src/db/for-feature.db';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [MongooseModule.forFeature(forFeatureDb)],
  exports: [UserService]
})
export class UserModule {}
