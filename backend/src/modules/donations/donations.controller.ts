// src/modules/donations/donations.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DonationsService } from '@modules/donations/donations.service';
import { CreateDonationDto } from '@modules/donations/dto/create-donation.dto';
import { UpdateDonationStatusDto } from '@modules/donations/dto/update-donation-status.dto';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';
import { RolesGuard } from '@shared/guards/roles.guard';
import { Roles } from '@shared/decorators/roles.decorator';
import { UserRole } from '@modules/users/enums/user-role.enum';
import { Public } from '@shared/decorators/public.decorator';
import { ParseObjectIdPipe } from '@shared/pipes/parse-object-id.pipe';

@ApiTags('donations')
@Controller('donations')
@ApiBearerAuth()
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}
  @Public()
  @Post()
  @ApiOperation({
    summary: 'Submit a new donation',
  })
  create(@Body() dto: CreateDonationDto) {
    return this.donationsService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Get all donations',
  })
  findAll() {
    return this.donationsService.findAll();
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Get donation stats',
  })
  getStats() {
    return this.donationsService.getStats();
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get(':id')
  @ApiOperation({
    summary: 'Get donation by ID',
  })
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.donationsService.findById(id);
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id/status')
  @ApiOperation({
    summary: 'Update donation status',
  })
  updateStatus(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UpdateDonationStatusDto,
  ) {
    return this.donationsService.updateStatus(id, dto);
  }
}
