import { CarSize } from "@prisma/client";
import { IsEnum, IsString } from "class-validator";

export class ParkingCarCustomerDto {
    @IsString()
    plate_number: string

    @IsEnum(CarSize)
    size: CarSize
}
