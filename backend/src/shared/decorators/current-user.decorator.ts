// src/shared/decorators/current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDocument } from '@modules/users/schemas/user.schema';
import { Request } from 'express';

export const CurrentUser = createParamDecorator(
  (data: keyof UserDocument | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user as UserDocument;
    return data ? user[data] : user;
  },
);
