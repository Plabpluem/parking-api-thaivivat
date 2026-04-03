import { Test, TestingModule } from '@nestjs/testing';
import { CarCustomerService } from './car_customer.service';

describe('CarCustomerService', () => {
  let service: CarCustomerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CarCustomerService],
    }).compile();

    service = module.get<CarCustomerService>(CarCustomerService);
  });

  // it('should be defined', () => {
  //   expect(service).toBeDefined();
  // });
});
