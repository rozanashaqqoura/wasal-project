// src/modules/auth/dto/me-response.dto.ts
import { UserRole } from '@modules/users/enums/user-role.enum';

export class MeResponseDto {
  id!: string;
  name!: string;
  email!: string;
  phone!: string;
  role!: UserRole;
}
