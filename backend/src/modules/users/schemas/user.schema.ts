// src/modules/users/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRole } from '@modules/users/enums/user-role.enum';

export type UserDocument = User & Document;

@Schema({ timestamps: true, versionKey: false })
export class User {
  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email!: string;

  @Prop({ required: true, select: false })
  password!: string;

  @Prop({ required: true, trim: true })
  phone!: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.BENEFICIARY })
  role!: UserRole;

  @Prop({ default: true })
  isActive!: boolean;

  // بيانات الأسرة — بس لما role = beneficiary
  @Prop({ trim: true })
  familyName?: string;

  @Prop({ min: 1 })
  familySize?: number;

  @Prop({ trim: true })
  address?: string;
  createdAt!: Date;
  updatedAt!: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
