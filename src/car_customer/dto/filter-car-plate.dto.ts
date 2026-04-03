import { CarSize } from "@prisma/client";
import { IsEnum } from "class-validator";

export class FilterCarPlateDto {
    @IsEnum(CarSize)
    size: CarSize
}