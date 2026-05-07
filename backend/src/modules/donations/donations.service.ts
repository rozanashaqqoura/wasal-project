import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Donation,
  DonationDocument,
} from '@modules/donations/schemas/donation.schema';
import { CreateDonationDto } from '@modules/donations/dto/create-donation.dto';
import { UpdateDonationStatusDto } from '@modules/donations/dto/update-donation-status.dto';
import { DonationStatus } from '@modules/donations/enums/donation-status.enum';

type DonationStats = {
  total: number;
  pending: number;
  received: number;
  distributed: number;
};

@Injectable()
export class DonationsService {
  constructor(
    @InjectModel(Donation.name)
    private readonly donationModel: Model<DonationDocument>,
  ) {}

  async create(dto: CreateDonationDto): Promise<DonationDocument> {
    return this.donationModel.create(dto);
  }

  async findAll(): Promise<DonationDocument[]> {
    return this.donationModel.find().sort({ createdAt: -1 }).exec();
  }

  async findById(id: string): Promise<DonationDocument> {
    const donation = await this.donationModel.findById(id).exec();

    if (!donation) {
      throw new NotFoundException('Donation not found');
    }

    return donation;
  }

  async updateStatus(
    id: string,
    dto: UpdateDonationStatusDto,
  ): Promise<DonationDocument> {
    const donation = await this.donationModel
      .findByIdAndUpdate(
        id,
        {
          status: dto.status,
        },
        {
          new: true,
        },
      )
      .exec();

    if (!donation) {
      throw new NotFoundException('Donation not found');
    }

    return donation;
  }

  async getTotalReceived(): Promise<number> {
    const result = await this.donationModel.aggregate<{
      total: number;
    }>([
      {
        $match: {
          status: DonationStatus.RECEIVED,
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: '$amount',
          },
        },
      },
    ]);

    return result[0]?.total ?? 0;
  }

  async getStats(): Promise<DonationStats> {
    const stats: DonationStats = {
      total: 0,
      pending: 0,
      received: 0,
      distributed: 0,
    };

    const result = await this.donationModel.aggregate<{
      _id: DonationStatus;
      count: number;
      amount: number;
    }>([
      {
        $group: {
          _id: '$status',
          count: {
            $sum: 1,
          },
          amount: {
            $sum: '$amount',
          },
        },
      },
    ]);

    result.forEach((item) => {
      stats.total += item.amount;
      stats[item._id] = item.count;
    });

    return stats;
  }
}
