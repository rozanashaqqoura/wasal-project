// src/shared/guards/roles.guard.ts
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthMessages } from '@modules/auth/enums/auth-messages.enum';
import { UserRole } from '@modules/users/enums/user-role.enum';
import { Request } from 'express';
import { ROLES_KEY } from '@shared/decorators/roles.decorator';
import { UserDocument } from '@modules/users/schemas/user.schema';
import { IS_PUBLIC_KEY } from '@shared/decorators/public.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as UserDocument;

    if (!user) {
      throw new ForbiddenException(AuthMessages.FORBIDDEN);
    }

    const hasRole = requiredRoles.includes(user.role);
    if (!hasRole) {
      throw new ForbiddenException(AuthMessages.FORBIDDEN);
    }

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return true;
  }
}
