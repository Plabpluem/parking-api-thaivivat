import { PartialType } from '@nestjs/mapped-types';
import { ParkingCarCustomerDto } from './parking-car_customer.dto';
import { IsString } from 'class-validator';

export class LeaveCarCustomerDto {
  @IsString()
  plate_number: string;
}
