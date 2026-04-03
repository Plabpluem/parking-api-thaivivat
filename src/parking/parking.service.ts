import { HttpException, Injectable } from '@nestjs/common';
import { CreateParkingDto } from './dto/create-parking.dto';
import { UpdateParkingDto } from './dto/update-parking.dto';
import { PrismaService } from 'src/prisma.service';
import { HelperService } from 'src/helper/response-helper.service';
import { FilterParkingNumberDto } from './dto/filter-parking-number.dto';

@Injectable()
export class ParkingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly helperService: HelperService,
  ) {}
  async create(dto: CreateParkingDto) {
    try {
      const response = await this.prisma.parkingLot.create({
        data: {
          number: dto.number,
        },
      });
      return response;
    } catch (error) {
      this.helperService.throwError(error);
    }
  }

  async findAllStatus() {
    try {
      const response = await this.prisma.parkingLot.findMany({
        select: {
          is_available: true,
          number: true,
          car_customer: true,
        },
      });
      return response;
    } catch (error) {
      this.helperService.throwError(error);
    }
  }

  async findAllByCarSize(dto: FilterParkingNumberDto) {
    try {
      const parking_number = await this.prisma.parkingLot.findMany({
        where: {
          is_available: false,
          car_customer: {
            size: dto.size,
          },
        },
        select: {
          number: true,
        },
      });
      return parking_number;
    } catch (error) {
      this.helperService.throwError(error);
    }
  }
}
