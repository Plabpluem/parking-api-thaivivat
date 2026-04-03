import { Test, TestingModule } from '@nestjs/testing';
import { CarCustomerController } from './car_customer.controller';
import { CarCustomerService } from './car_customer.service';
import { HelperService } from '../helper/response-helper.service';
import { PrismaService } from '../prisma.service';
import { HttpException, HttpStatus } from '@nestjs/common';

const mockPrisma = {
  carCustomer: {
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findMany: jest.fn(),
  },
  parkingLot: {
    findFirst: jest.fn(),
    update: jest.fn(),
  },
};

describe('CarCustomerController', () => {
  let controller: CarCustomerController;
  let service: CarCustomerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarCustomerController],
      providers: [
        CarCustomerService,  // ใช้ตัวจริง
        HelperService,       // ใช้ตัวจริง
        { provide: PrismaService, useValue: mockPrisma }, // mock แค่ DB
      ],
    }).compile();

    controller = module.get<CarCustomerController>(CarCustomerController);
    service = module.get<CarCustomerService>(CarCustomerService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('parking success', () => {
    const dto = { plate_number: 'ฎพ12345', size: 'large' as const };

    it('should park a new car and return response', async () => {
      mockPrisma.carCustomer.findFirst
        .mockResolvedValueOnce(null);

      const createdCar = { id: 1, plate_number: 'ฎพ12345', size: 'large' };
      mockPrisma.carCustomer.create.mockResolvedValue(createdCar);

      const parkingSlot = { id: 1, number: 1, is_available: true };
      mockPrisma.parkingLot.findFirst.mockResolvedValue(parkingSlot);
      mockPrisma.parkingLot.update.mockResolvedValue({});

      const result = await controller.parking(dto as any);

      expect(result).toEqual({
        message: 'successfully',
        statusCode: HttpStatus.CREATED,
        data: { ...createdCar,parking_lots: parkingSlot },
      });
    });
  });

  describe('parking error', () => {
    const dto = { plate_number: 'ฎพ1234', size: 'large' as const };

    it('should throw when car is already parked', async () => {
      // มีรถคันนี้จอดอยู่แล้ว
      mockPrisma.carCustomer.findFirst.mockResolvedValue({
        id: 1,
        plate_number: 'ฎพ1234',
        size: 'large',
      });

      await expect(controller.parking(dto as any)).rejects.toThrow(HttpException);
    });
  });

  describe('leaving success', () => {
    const dto = { plate_number: 'ฎพ1234' };

    it('should leave parking and return response', async () => {
      mockPrisma.carCustomer.findFirst.mockResolvedValue({
        id: 1,
        plate_number: 'ฎพ1234',
      });
      mockPrisma.parkingLot.update.mockResolvedValue({});

      const result = await controller.leaving(dto as any);

      expect(result).toEqual({
        message: 'successfully',
        statusCode: HttpStatus.OK,
        data: undefined,
      });
    });
  });

  describe('leaving error', () => {
    const dto = { plate_number: 'ฎพ1234' };

    it('should throw when car not found in parking', async () => {
      mockPrisma.carCustomer.findFirst.mockResolvedValue(null);

      await expect(controller.leaving(dto as any)).rejects.toThrow(HttpException);
    });
  });

  describe('findall-platenumber', () => {
    it('should return plate numbers when found', async () => {
      const dto = { size: 'small' };
      const plates = [{ plate_number: 'ER1234' }, { plate_number: 'AB5678' }];
      mockPrisma.carCustomer.findMany.mockResolvedValue(plates);

      const result = await controller.findallPlatenumber(dto as any);

      expect(mockPrisma.carCustomer.findMany).toHaveBeenCalledWith({
        where: { size: 'small', parking_lots: { isNot: null } },
        select: { plate_number: true },
      });
      expect(result).toEqual({
        message: 'successfully',
        statusCode: HttpStatus.OK,
        data: plates,
      });
    });

    it('should return empty array when no car of that size is parked', async () => {
      const dto = { size: 'large' };

      mockPrisma.carCustomer.findMany.mockResolvedValue([]);

      const result = await controller.findallPlatenumber(dto as any);

      expect(result).toEqual({
        message: 'successfully',
        statusCode: HttpStatus.OK,
        data: [],
      });
    });
  })
});