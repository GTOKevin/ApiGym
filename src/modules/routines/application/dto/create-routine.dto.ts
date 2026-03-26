import { IsString, IsUUID, IsOptional, IsBoolean, IsArray, ValidateNested, IsNumber, Min, IsEnum, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { DayOfWeek } from '@prisma/client';

export class RoutineExerciseDto {
  @IsUUID()
  exerciseId: string;

  @IsNumber()
  @Min(1)
  sets: number;

  @IsNumber()
  @Min(1)
  reps: number;

  @IsNumber()
  @Min(0)
  weightKg: number;

  @IsNumber()
  @Min(0)
  restSeconds: number;

  @IsNumber()
  @Min(1)
  orderIndex: number;
}

export class CreateRoutineDto {
  @IsUUID()
  clientId: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsEnum(DayOfWeek)
  dayOfWeek?: DayOfWeek;

  @IsOptional()
  @IsBoolean()
  isTemplate?: boolean;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoutineExerciseDto)
  exercises: RoutineExerciseDto[];
}
