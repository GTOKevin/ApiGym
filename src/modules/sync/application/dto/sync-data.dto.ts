import { IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateRoutineDto } from '../../../routines/application/dto/create-routine.dto';
import { CreateMeasurementDto } from '../../../measurements/application/dto/create-measurement.dto';

export class SyncDataDto {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRoutineDto)
  routines?: CreateRoutineDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMeasurementDto)
  measurements?: CreateMeasurementDto[];
}
