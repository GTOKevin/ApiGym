import { IsUUID, IsNumber, IsOptional, IsDateString, Min } from 'class-validator';

export class CreateMeasurementDto {
  @IsUUID()
  userId: string;

  @IsDateString()
  date: string;

  @IsNumber()
  @Min(0)
  weightKg: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  bodyFatPct?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  muscleMassKg?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  chestCm?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  armsCm?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  waistCm?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  legsCm?: number;
}
