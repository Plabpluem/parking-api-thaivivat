import { Test, TestingModule } from '@nestjs/testing';
import { ParkingController } from './parking.controller';
import { ParkingService } from './parking.service';
import { HelperService } from '../helper/response-helper.service';
import { PrismaService } from '../prisma.service';
import { HttpException, HttpStatus } from '@nestjs/common';

const mockPrisma = {
  parkingLot: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
};

describe('ParkingController', () => {
  let controller: ParkingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParkingController],
      providers: [
        ParkingService,   // ใช้ตัวจริง
        HelperService,    // ใช้ตัวจริง
        { provide: PrismaService, useValue: mockPrisma }, // mock แค่ DB
      ],
    }).compile();

    controller = module.get<ParkingController>(ParkingController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const dto = { number: 1 };
    const createdParkingLot = { id: 1, uuid: 'abc-123', number: 1, is_available: true };

    it('should create parking lot and return response', async () => {
      mockPrisma.parkingLot.create.mockResolvedValue(createdParkingLot);

      const result = await controller.create(dto);

      expect(mockPrisma.parkingLot.create).toHaveBeenCalledWith({
        data: { number: 1 },
      });
      expect(result).toEqual({
        message: 'successfully',
        statusCode: HttpStatus.CREATED,
        data: createdParkingLot,
      });
    });

    it('should throw when prisma error', async () => {
      mockPrisma.parkingLot.create.mockRejectedValue(new Error('duplicate'));

      await expect(controller.create(dto)).rejects.toThrow(HttpException);
    });
  });

  describe('findAll (status)', () => {
    it('should return all parking lot status', async () => {
      const statusData = [
        { number: 1, is_available: true, car_customer: null },
        { number: 2, is_available: false, car_customer: { plate_number: 'กข1234', size: 'small' } },
      ];
      mockPrisma.parkingLot.findMany.mockResolvedValue(statusData);

      const result = await controller.findAll();

      expect(result).toEqual({
        message: 'successfully',
        statusCode: HttpStatus.OK,
        data: statusData,
      });
    });
  });

  describe('findAllByCarSize', () => {
    it('should return slot numbers when found', async () => {
      const dto = { size: 'small' };
      const slotNumbers = [{ number: 1 }, { number: 3 }];
      mockPrisma.parkingLot.findMany.mockResolvedValue(slotNumbers);

      const result = await controller.findAllByCarSize(dto as any);

      expect(mockPrisma.parkingLot.findMany).toHaveBeenCalledWith({
        where: { is_available: false, car_customer: { size: 'small' } },
        select: { number: true },
      });
      expect(result).toEqual({
        message: 'successfully',
        statusCode: HttpStatus.OK,
        data: slotNumbers,
      });
    });

    it('should return empty array when no car of that size is parked', async () => {
      const dto = { size: 'large' };
      mockPrisma.parkingLot.findMany.mockResolvedValue([]);

      const result = await controller.findAllByCarSize(dto as any);

      expect(result).toEqual({
        message: 'successfully',
        statusCode: HttpStatus.OK,
        data: [],
      });
    });
  });
});
