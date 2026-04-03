import { Test, TestingModule } from '@nestjs/testing';
import { ParkingController } from './parking.controller';
import { ParkingService } from './parking.service';
import { HelperService } from '../helper/response-helper.service';

// 1) Mock dependency ทั้งหมดที่ controller ใช้
//    - ParkingService: mock method create
//    - HelperService: mock method createResponse
const mockParkingService = {
  create: jest.fn(),
};

const mockHelperService = {
  createResponse: jest.fn(),
};

describe('ParkingController', () => {
  let controller: ParkingController;

  // 2) สร้าง testing module โดย inject mock แทน dependency จริง
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParkingController],
      providers: [
        { provide: ParkingService, useValue: mockParkingService },
        { provide: HelperService, useValue: mockHelperService },
      ],
    }).compile();

    controller = module.get<ParkingController>(ParkingController);

    // 3) reset mock ก่อนแต่ละ test เพื่อไม่ให้ค่าจาก test ก่อนหน้ามาปน
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const dto = { number: 1 };
    const createdParkingLot = { id: 1, uuid: 'abc-123', number: 1, is_available: true };

    // 4) Happy path: ตรวจว่า service.create ถูกเรียกด้วย dto ที่ถูกต้อง
    //    และ helperService.createResponse ถูกเรียกด้วย result จาก service
    it('should call parkingService.create and return formatted response', async () => {
      mockParkingService.create.mockResolvedValue(createdParkingLot);
      mockHelperService.createResponse.mockReturnValue({
        message: 'successfully',
        statusCode: 201,
        data: createdParkingLot,
      });

      await controller.create(dto);

      // ตรวจว่า service ถูกเรียกด้วย dto
      expect(mockParkingService.create).toHaveBeenCalledWith(dto);
      // ตรวจว่า helper ถูกเรียกด้วยผลลัพธ์จาก service
      expect(mockHelperService.createResponse).toHaveBeenCalledWith(createdParkingLot);
    });
  });
});
