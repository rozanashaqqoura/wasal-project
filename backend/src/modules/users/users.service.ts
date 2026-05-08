import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '@modules/users/schemas/user.schema';
import { CreateUserDto } from '@modules/users/dto/create-user-request.dto';
import { UpdateUserDto } from '@modules/users/dto/update-user.dto';
import { UserRole } from '@modules/users/enums/user-role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(dto: CreateUserDto): Promise<UserDocument> {
    const existingUser = await this.userModel.exists({
      email: dto.email,
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const user = new this.userModel({
      ...dto,
      password: hashedPassword,
    });

    return user.save();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel
      .findOne({
        email,
        isActive: true,
      })
      .select('+password')
      .exec();
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel
      .findOne({
        _id: id,
        isActive: true,
      })
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel
      .find({ isActive: true })
      .sort({ createdAt: -1 })
      .exec();
  }

  async deactivate(id: string): Promise<UserDocument> {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true },
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: string, dto: Partial<UpdateUserDto>): Promise<UserDocument> {
    const user = await this.userModel
      .findOneAndUpdate({ _id: id, isActive: true }, { ...dto }, { new: true })
      .exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findAllBeneficiaries(): Promise<UserDocument[]> {
    return this.userModel
      .find({ role: UserRole.BENEFICIARY, isActive: true })
      .sort({ createdAt: -1 })
      .exec();
  }
}
