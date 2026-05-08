// src/modules/auth/auth.controller.ts
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from '@modules/auth/auth.service';
import { LoginDto } from '@modules/auth/dto/login.dto';
import { RegisterDto } from '@modules/auth/dto/register.dto';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';
import { CurrentUser } from '@shared/decorators/current-user.decorator';
import type { UserDocument } from '@modules/users/schemas/user.schema';
import { UserResponseDto } from '@modules/users/dto/user-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Public — الأسرة تسجل لأول مرة
  @Post('register')
  @ApiOperation({ summary: 'Register a new beneficiary' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  // Public — أي مستخدم يسجل دخول
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // Protected — يجيب بياناتي الحالية
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user' })
  getMe(@CurrentUser() user: UserDocument): UserResponseDto {
    return new UserResponseDto(user);
  }
}
