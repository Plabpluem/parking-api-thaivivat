import { Injectable } from '@nestjs/common';
import { ParkingCarCustomerDto } from './dto/parking-car_customer.dto';
import { LeaveCarCustomerDto } from './dto/leave-car_customer.dto';
import { PrismaService } from 'src/prisma.service';
import { HelperService } from 'src/helper/response-helper.service';
import { FilterCarPlateDto } from './dto/filter-car-plate.dto';

@Injectable()
export class CarCustomerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly helperService: HelperService,
  ) {}

  async parkingCar(dto: ParkingCarCustomerDto) {
    try {
      const existCarParking = await this.prisma.carCustomer.findFirst({
        where:{
          plate_number: dto.plate_number,
          parking_lots: {isNot: null}
        }
      })

      if(existCarParking){
        throw new Error('มีรถคันนี้กำลังจอด ในที่จอดอยู่')
      }

      const existCustomer = await this.prisma.carCustomer.findFirst({
        where: {
          plate_number: dto.plate_number,
        },
      });

      let responseCar;
      if (existCustomer) {
        responseCar = await this.prisma.carCustomer.update({
          where: {
            id: existCustomer.id,
          },
          data: {
            size: dto.size,
          },
        });
      } else {
        responseCar = await this.prisma.carCustomer.create({
          data: {
            plate_number: dto.plate_number,
            size: dto.size,
          },
        });
      }

      const firstParkingAvailable = await this.prisma.parkingLot.findFirst({
        where: {
          is_available: true,
        },
      });
      await this.prisma.parkingLot.update({
        where: {
          id: firstParkingAvailable?.id,
        },
        data: {
          is_available: false,
          id_car_customer: responseCar.id,
        },
      });

      return { ...responseCar, parking_lots: firstParkingAvailable };
    } catch (error) {
      this.helperService.throwError(error);
    }
  }

  async leavingCar(dto: LeaveCarCustomerDto) {
    try {
      const car = await this.prisma.carCustomer.findFirst({
        where: {
          plate_number: dto.plate_number,
          parking_lots: {isNot: null}
        },
      });

      if (!car) {
        throw new Error('Not found car in parking');
      }

      await this.prisma.parkingLot.update({
        where: {
          id_car_customer: car.id,
        },
        data: {
          is_available: true,
          id_car_customer: null,
        },
      });
    } catch (error) {
      this.helperService.throwError(error);
    }
  }

  async findallPlatenumber(dto: FilterCarPlateDto) {
    try {
      const car_plate = await this.prisma.carCustomer.findMany({
        where: {
          size: dto.size,
          parking_lots: { isNot: null },
        },
        select: {
          plate_number: true,
        },
      });
      return car_plate;
    } catch (error) {
      this.helperService.throwError(error);
    }
  }
}
