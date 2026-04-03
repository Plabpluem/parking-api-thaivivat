import { Module } from '@nestjs/common';
import { CarCustomerService } from './car_customer.service';
import { CarCustomerController } from './car_customer.controller';
import { SharedModule } from 'src/shared.module';

@Module({
  imports:[SharedModule],
  controllers: [CarCustomerController],
  providers: [CarCustomerService],
})
export class CarCustomerModule {}
