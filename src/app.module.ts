import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CarCustomerModule } from './car_customer/car_customer.module';
import { ParkingModule } from './parking/parking.module';

@Module({
  imports: [CarCustomerModule, ParkingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
