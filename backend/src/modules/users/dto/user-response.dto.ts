// src/modules/users/dto/user-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@modules/users/enums/user-role.enum';
import { UserDocument } from '@modules/users/schemas/user.schema';

export class UserResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  phone!: string;

  @ApiProperty({ enum: UserRole })
  role!: UserRole;

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty()
  createdAt!: Date;
  @ApiProperty()
  updatedAt!: Date;

  constructor(user: UserDocument) {
    this.id = user._id.toString();
    this.name = user.name;
    this.email = user.email;
    this.phone = user.phone;
    this.role = user.role;
    this.isActive = user.isActive;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
