import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { RoutinesService } from '../../application/services/routines.service';
import { CreateRoutineDto } from '../../application/dto/create-routine.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('routines')
export class RoutinesController {
  constructor(private readonly routinesService: RoutinesService) {}

  @Roles(Role.TRAINER, Role.ADMIN)
  @Post()
  create(@Request() req: any, @Body() createRoutineDto: CreateRoutineDto) {
    const trainerId = req.user.userId;
    return this.routinesService.createRoutine(trainerId, createRoutineDto);
  }

  @Roles(Role.USER, Role.TRAINER, Role.ADMIN)
  @Get('my-routines')
  getMyRoutines(@Request() req: any) {
    return this.routinesService.getClientRoutines(req.user.userId);
  }

  @Roles(Role.USER)
  @Get('today')
  getTodayRoutine(@Request() req: any) {
    return this.routinesService.getClientTodayRoutine(req.user.userId);
  }

  @Roles(Role.USER)
  @Patch('exercise/:id/complete')
  markExerciseCompleted(@Param('id') id: string, @Body('isCompleted') isCompleted: boolean) {
    return this.routinesService.markExerciseCompleted(id, isCompleted);
  }
}
