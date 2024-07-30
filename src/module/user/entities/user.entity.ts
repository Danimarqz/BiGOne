import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type UserDocument = User & Document;

@Schema({ collection: 'Users' })
export class User {
  @Prop({ required: true })
  Name: string;

  @Prop({ required: true, unique: true })
  Email: string;

  @Prop({ required: true })
  Password: string;

  @Prop({ type: String, unique: true, sparse: true })
  DeviceId: string | null;

  @Prop({ default: null })
  Lastlogin: number | null;

  @Prop({ default: 1 })
  Status: number | null;
}
export const UserSchema = SchemaFactory.createForClass(User);
