// src/modules/users/dto/create-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,} from 'class-validator';
import { UserRole } from '@modules/users/enums/user-role.enum';


export class CreateUserDto {
  @ApiProperty({ example: 'rozana' })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({ example: 'rozana@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'rozana6112000', minLength: 8 })
  @IsNotEmpty()
  @MinLength(8)
  @IsString()
  password!: string;

  @ApiProperty({ example: '0595111153' })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[0-9]+$/)
  phone!: string;

  @ApiProperty({ enum: UserRole, default: UserRole.BENEFICIARY })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}