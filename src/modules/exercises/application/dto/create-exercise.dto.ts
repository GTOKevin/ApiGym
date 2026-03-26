import { IsString, IsNotEmpty, IsOptional, IsUrl, MaxLength } from 'class-validator';

export class CreateExerciseDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  muscleGroup: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(255)
  videoUrl?: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(255)
  imageUrl?: string;
}
