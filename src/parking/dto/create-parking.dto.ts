import { IsNumber } from "class-validator";

export class CreateParkingDto {
    @IsNumber()
    number: number
}
