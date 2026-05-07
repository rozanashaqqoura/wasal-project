// src/modules/auth/dto/auth-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@modules/users/enums/user-role.enum';

export class AuthResponseDto {
  @ApiProperty({
    example: 'jwt-token-here',
  })
  accessToken!: string;

  @ApiProperty({
    example: '665f1c92b4e9d8c9d1a12345',
  })
  id!: string;

  @ApiProperty({
    example: 'Rozana',
  })
  name!: string;

  @ApiProperty({
    example: 'rozana@example.com',
  })
  email!: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.BENEFICIARY,
  })
  role!: UserRole;
}
