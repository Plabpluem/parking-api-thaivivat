import { Test, TestingModule } from '@nestjs/testing';
import { CarCustomerService } from './car_customer.service';
import { PrismaService } from '../prisma.service';
import { HelperService } from '../helper/response-helper.service';
import { HttpException } from '@nestjs/common';

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

describe('CarCustomerService', () => {
  let service: CarCustomerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CarCustomerService,
        HelperService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<CarCustomerService>(CarCustomerService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('parkingCar', () => {
    const dto = { plate_number: 'กข1234', size: 'small' as const };

    it('สร้างข้อมูลรถใหม่ และจอดรถ', async () => {
      mockPrisma.carCustomer.findFirst
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);

      const createdCar = { id: 1, plate_number: 'กข1234', size: 'small' };
      mockPrisma.carCustomer.create.mockResolvedValue(createdCar);

      const parkingSlot = { id: 1, number: 1, is_available: true };
      mockPrisma.parkingLot.findFirst.mockResolvedValue(parkingSlot);
      mockPrisma.parkingLot.update.mockResolvedValue({});

      const result = await service.parkingCar(dto as any);

      expect(mockPrisma.carCustomer.create).toHaveBeenCalledWith({
        data: { plate_number: 'กข1234', size: 'small' },
      });
      expect(mockPrisma.parkingLot.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { is_available: false, id_car_customer: 1 },
      });
      expect(result).toEqual({ ...createdCar, parking_lots: parkingSlot });
    });

    it('update ข้อมูลรถที่มี และจอดรถ', async () => {
      const existingCustomer = {
        id: 5,
        plate_number: 'กข1234',
        size: 'medium',
      };
      mockPrisma.carCustomer.findFirst
        .mockResolvedValueOnce(null) // existCarParking → ไม่ได้จอดอยู่
        .mockResolvedValueOnce(existingCustomer); // existCustomer → มีลูกค้าเดิม

      const updatedCar = { id: 5, plate_number: 'กข1234', size: 'small' };
      mockPrisma.carCustomer.update.mockResolvedValue(updatedCar);

      const parkingSlot = { id: 2, number: 2, is_available: true };
      mockPrisma.parkingLot.findFirst.mockResolvedValue(parkingSlot);
      mockPrisma.parkingLot.update.mockResolvedValue({});

      const result = await service.parkingCar(dto as any);

      expect(mockPrisma.carCustomer.update).toHaveBeenCalledWith({
        where: { id: 5 },
        data: { size: 'small' },
      });
      expect(result).toEqual({ ...updatedCar, parking_lots: parkingSlot });
    });

    it('throw error ว่ารถนี้จอดแล้ว', async () => {
      mockPrisma.carCustomer.findFirst.mockResolvedValue({
        id: 1,
        plate_number: 'กข1234',
        size: 'small',
      });

      await expect(service.parkingCar(dto as any)).rejects.toThrow(
        HttpException,
      );
    });

    it('throw error ไม่มีที่จอดรถ', async () => {
      mockPrisma.carCustomer.findFirst
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);

      mockPrisma.carCustomer.create.mockResolvedValue({ id: 1 });
      mockPrisma.parkingLot.findFirst.mockResolvedValue(null);

      await expect(service.parkingCar(dto as any)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('leavingCar', () => {
    const dto = { plate_number: 'กข1234' };

    it('success หากพบข้อมูลรถที่จอด', async () => {
      mockPrisma.carCustomer.findFirst.mockResolvedValue({
        id: 1,
        plate_number: 'กข1234',
      });
      mockPrisma.parkingLot.update.mockResolvedValue({});

      await service.leavingCar(dto as any);

      expect(mockPrisma.parkingLot.update).toHaveBeenCalledWith({
        where: { id_car_customer: 1 },
        data: { is_available: true, id_car_customer: null },
      });
    });

    it('throw error หากไม่พบข้อมูลรถที่จอด', async () => {
      mockPrisma.carCustomer.findFirst.mockResolvedValue(null);

      await expect(service.leavingCar(dto as any)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('findallPlatenumber', () => {
    it('return มีข้อมูล', async () => {
      const plates = [{ plate_number: 'กข1234' }, { plate_number: 'กค5678' }];
      mockPrisma.carCustomer.findMany.mockResolvedValue(plates);

      const result = await service.findallPlatenumber({ size: 'small' } as any);

      expect(mockPrisma.carCustomer.findMany).toHaveBeenCalledWith({
        where: { size: 'small', parking_lots: { isNot: null } },
        select: { plate_number: true },
      });
      expect(result).toEqual(plates);
    });

    it('return ไม่มีข้อมูล', async () => {
      mockPrisma.carCustomer.findMany.mockResolvedValue([]);

      const result = await service.findallPlatenumber({ size: 'large' } as any);

      expect(result).toEqual([]);
    });
  });
});
