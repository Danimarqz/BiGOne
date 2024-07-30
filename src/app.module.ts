import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './module/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env'}),
    MongooseModule.forRoot(process.env.DB),
    UserModule
  ]
})
export class AppModule {}
