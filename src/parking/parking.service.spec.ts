import { Test, TestingModule } from '@nestjs/testing';
import { ParkingService } from './parking.service';
import { PrismaService } from '../prisma.service';
import { HelperService } from '../helper/response-helper.service';
import { HttpException } from '@nestjs/common';

const mockPrisma = {
  parkingLot: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
};

describe('ParkingService', () => {
  let service: ParkingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParkingService,
        HelperService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ParkingService>(ParkingService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a parking lot', async () => {
      const expected = {
        id: 1,
        uuid: 'abc-123',
        number: 1,
        is_available: true,
      };
      mockPrisma.parkingLot.create.mockResolvedValue(expected);

      const result = await service.create({ number: 1 });

      expect(mockPrisma.parkingLot.create).toHaveBeenCalledWith({
        data: { number: 1 },
      });
      expect(result).toEqual(expected);
    });

    it('should throw error', async () => {
      mockPrisma.parkingLot.create.mockRejectedValue(new Error('duplicate'));

      await expect(service.create({ number: 1 })).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('findAllStatus', () => {
    it('return status of parking สำเร็จ', async () => {
      const statusData = [
        { id: 1, number: 1, is_available: true, car_customer: null },
        {
          id: 2,
          number: 2,
          is_available: false,
          car_customer: { plate_number: 'กข1234', size: 'small' },
        },
      ];
      mockPrisma.parkingLot.findMany.mockResolvedValue(statusData);

      const result = await service.findAllStatus();

      expect(mockPrisma.parkingLot.findMany).toHaveBeenCalledWith({
        select: { is_available: true, number: true, car_customer: true },
      });
      expect(result).toEqual(statusData);
    });

    it('ไม่พบข้อมูล status of parking', async () => {
      mockPrisma.parkingLot.findMany.mockResolvedValue([]);

      const result = await service.findAllStatus();

      expect(result).toEqual([]);
    });
  });

  describe('findAllByCarSize', () => {
    it('return slot numbers สำเร็จ', async () => {
      const slotNumbers = [{ number: 1 }, { number: 3 }];
      mockPrisma.parkingLot.findMany.mockResolvedValue(slotNumbers);

      const result = await service.findAllByCarSize({ size: 'small' } as any);

      expect(mockPrisma.parkingLot.findMany).toHaveBeenCalledWith({
        where: { is_available: false, car_customer: { size: 'small' } },
        select: { number: true },
      });
      expect(result).toEqual(slotNumbers);
    });

    it('ไม่พบข้อมูล slot numbers', async () => {
      mockPrisma.parkingLot.findMany.mockResolvedValue([]);

      const result = await service.findAllByCarSize({ size: 'large' } as any);

      expect(result).toEqual([]);
    });
  });
});
