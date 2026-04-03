import { Test, TestingModule } from '@nestjs/testing';
import { CarCustomerController } from './car_customer.controller';
import { CarCustomerService } from './car_customer.service';
import { HelperService } from 'src/helper/response-helper.service';

const mockCarCustomerService = {
  parking: jest.fn(),
  leaving: jest.fn(),
};

const mockHelperService = {
  createResponse: jest.fn(),
};

describe('CarCustomerController', () => {
  let controller: CarCustomerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarCustomerController],
      providers: [
        { provide: CarCustomerService, useValue: mockCarCustomerService },
        { provide: HelperService, useValue: mockHelperService },
      ],
    }).compile();

    controller = module.get<CarCustomerController>(CarCustomerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
