import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ExercisesService } from '../../application/services/exercises.service';
import { CreateExerciseDto } from '../../application/dto/create-exercise.dto';
import { UpdateExerciseDto } from '../../application/dto/update-exercise.dto';
import { ExerciseQueryDto } from '../../application/dto/exercise-query.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';

@ApiTags('Exercises')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Roles(Role.ADMIN, Role.TRAINER)
  @Post()
  create(@Body() createExerciseDto: CreateExerciseDto) {
    return this.exercisesService.create(createExerciseDto);
  }

  @ApiOperation({ summary: 'Obtener lista paginada de ejercicios con filtros' })
  @Get()
  async findAll(@Query() query: ExerciseQueryDto) {
    const { page = 1, limit = 10, muscleGroup, search } = query;
    const { data, total } = await this.exercisesService.findAll(page, limit, muscleGroup, search);
    return new PaginatedResponseDto(data, total, page, limit);
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
