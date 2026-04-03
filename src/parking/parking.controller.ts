import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ParkingService } from './parking.service';
import { CreateParkingDto } from './dto/create-parking.dto';
import { UpdateParkingDto } from './dto/update-parking.dto';
import { HelperService } from 'src/helper/response-helper.service';
import { FilterParkingNumberDto } from './dto/filter-parking-number.dto';

@Controller('api/parking')
export class ParkingController {
  constructor(private readonly parkingService: ParkingService,private readonly helperService: HelperService) {}

  @Post()
  async create(@Body() createParkingDto: CreateParkingDto) {
    const response = await this.parkingService.create(createParkingDto);
    return this.helperService.createResponse(response)
  }

  @Get('status')
  async findAll() {
    const response = await this.parkingService.findAllStatus();
    return this.helperService.getResponse(response)
  }
  @Get('by-carsize')
  async findAllByCarSize(@Query() dto: FilterParkingNumberDto) {
    const response = await this.parkingService.findAllByCarSize(dto);
    return this.helperService.getResponse(response)
  }
}
