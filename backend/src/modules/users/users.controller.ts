// src/modules/users/users.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from '@modules/users/users.service';
import { UpdateUserDto } from '@modules/users/dto/update-user.dto';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';
import { RolesGuard } from '@shared/guards/roles.guard';
import { Roles } from '@shared/decorators/roles.decorator';
import { ParseObjectIdPipe } from '@shared/pipes/parse-object-id.pipe';
import { UserRole } from '@modules/users/enums/user-role.enum';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Admin يشوف كل الأسر
  @Get('beneficiaries')
  @ApiOperation({ summary: 'Get all beneficiary families' })
  findAllBeneficiaries() {
    return this.usersService.findAllBeneficiaries();
  }

  // Admin يشوف أسرة معينة
  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.usersService.findById(id);
  }

  // Admin يعدل بيانات أسرة
  @Patch(':id')
  @ApiOperation({ summary: 'Update user or family info' })
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.update(id, dto);
  }

  // Admin يعطل حساب أسرة
  @Delete(':id')
  @ApiOperation({ summary: 'Deactivate user' })
  deactivate(@Param('id', ParseObjectIdPipe) id: string) {
    return this.usersService.deactivate(id);
  }
}
