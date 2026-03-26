import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ExercisesService } from '../../application/services/exercises.service';
import { CreateExerciseDto } from '../../application/dto/create-exercise.dto';
import { UpdateExerciseDto } from '../../application/dto/update-exercise.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Roles(Role.ADMIN, Role.TRAINER)
  @Post()
  create(@Body() createExerciseDto: CreateExerciseDto) {
    return this.exercisesService.create(createExerciseDto);
  }

  // All authenticated users can see exercises
  @Get()
  findAll() {
    return this.exercisesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exercisesService.findOne(id);
  }

  @Roles(Role.ADMIN, Role.TRAINER)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExerciseDto: UpdateExerciseDto) {
    return this.exercisesService.update(id, updateExerciseDto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exercisesService.remove(id);
  }
}
