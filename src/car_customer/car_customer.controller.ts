import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CarCustomerService } from './car_customer.service';
import { ParkingCarCustomerDto } from './dto/parking-car_customer.dto';
import { HelperService } from 'src/helper/response-helper.service';
import { LeaveCarCustomerDto } from './dto/leave-car_customer.dto';
import { FilterCarPlateDto } from './dto/filter-car-plate.dto';

@Controller('api/car-customer')
export class CarCustomerController {
  constructor(
    private readonly carCustomerService: CarCustomerService,
    private readonly helperService: HelperService,
  ) {}

  @Post('parking')
  async parking(@Body() dto: ParkingCarCustomerDto) {
    const response = await this.carCustomerService.parkingCar(dto);
    return this.helperService.createResponse(response);
  }

  @Post('leaving')
  async leaving(@Body() dto: LeaveCarCustomerDto) {
    const response = await this.carCustomerService.leavingCar(dto);
    return this.helperService.createResponse(response);
  }

  @Get('number-by-sizecar')
  async findallPlatenumber(@Query() dto: FilterCarPlateDto) {
    const response = await this.carCustomerService.findallPlatenumber(dto);
    return this.helperService.getResponse(response);
  }
}
