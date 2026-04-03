import { CarSize } from "@prisma/client";
import { IsEnum } from "class-validator";

export class FilterParkingNumberDto {
    @IsEnum(CarSize)
    size: CarSize
}