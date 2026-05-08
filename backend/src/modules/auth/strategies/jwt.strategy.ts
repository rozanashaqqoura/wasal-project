// src/modules/auth/strategies/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';

import { Model } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthMessages } from '@modules/auth/enums/auth-messages.enum';
import { JwtPayload } from '@modules/auth/interfaces/jwt-payload.interface';

import { User, UserDocument } from '@modules/users/schemas/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,

    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      ignoreExpiration: false,

      secretOrKey: configService.get<string>('app.jwtSecret')!,
    });
  }

  async validate(payload: JwtPayload): Promise<UserDocument> {
    const user = await this.userModel.findById(payload.sub);

    if (!user || !user.isActive) {
      throw new UnauthorizedException(AuthMessages.UNAUTHORIZED);
    }

    return user;
  }
}
