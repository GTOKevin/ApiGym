import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IExerciseRepository } from '../../domain/interfaces/exercise.repository.interface';
import { CreateExerciseDto } from '../dto/create-exercise.dto';
import { UpdateExerciseDto } from '../dto/update-exercise.dto';

@Injectable()
export class ExercisesService {
  constructor(
    @Inject('IExerciseRepository')
    private readonly exerciseRepository: IExerciseRepository,
  ) {}

  async create(createExerciseDto: CreateExerciseDto) {
    return this.exerciseRepository.create({
      name: createExerciseDto.name,
      muscleGroup: createExerciseDto.muscleGroup,
      videoUrl: createExerciseDto.videoUrl || null,
      imageUrl: createExerciseDto.imageUrl || null,
    });
  }

  async findAll(page: number = 1, limit: number = 10, muscleGroup?: string, search?: string) {
    const skip = (page - 1) * limit;
    return this.exerciseRepository.findAll(skip, limit, muscleGroup, search);
  }

  async findOne(id: string) {
    const exercise = await this.exerciseRepository.findById(id);
    if (!exercise) {
      throw new NotFoundException(`Exercise with ID ${id} not found`);
    }
    return exercise;
  }

  async update(id: string, updateExerciseDto: UpdateExerciseDto) {
    await this.findOne(id); // Ensure exists
    return this.exerciseRepository.update(id, {
      name: updateExerciseDto.name,
      muscleGroup: updateExerciseDto.muscleGroup,
      videoUrl: updateExerciseDto.videoUrl,
      imageUrl: updateExerciseDto.imageUrl,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Ensure exists
    await this.exerciseRepository.delete(id);
  }
}
