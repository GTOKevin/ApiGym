import { IsString, IsUUID, IsOptional, IsArray, ValidateNested, IsNumber, Min, IsEnum, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { MealType } from '@prisma/client';

export class DietMealDto {
  @IsEnum(MealType)
  mealType: MealType;

  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  calories?: number;
}

export class CreateDietDto {
  @IsUUID()
  clientId: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DietMealDto)
  meals: DietMealDto[];
}
