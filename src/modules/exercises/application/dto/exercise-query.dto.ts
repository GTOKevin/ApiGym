import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

export class ExerciseQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Filtrar por grupo muscular' })
  @IsString()
  @IsOptional()
  muscleGroup?: string;

  @ApiPropertyOptional({ description: 'Buscar por nombre de ejercicio' })
  @IsString()
  @IsOptional()
  search?: string;
}
