import { Controller, Get, Post, Param, Body, UseGuards, Request, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { Role } from '@prisma/client';
import { IsUUID } from 'class-validator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AssignmentsService } from '../../application/services/assignments.service';
import { Roles } from 'src/common/decorators/roles.decorator';

class AssignClientDto {
  @IsUUID()
  clientId: string;

  @IsUUID()
  trainerId: string;
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  // Solo un Admin puede asignar un cliente a un trainer
  @Roles(Role.ADMIN)
  @Post()
  async assignClient(@Body() dto: AssignClientDto) {
    return this.assignmentsService.assignClientToTrainer(dto.trainerId, dto.clientId);
  }

  // Un Trainer puede ver sus propios clientes (el ID se saca del token)
  @Roles(Role.TRAINER)
  @Get('my-clients')
  async getMyClients(@Request() req: any) {
    const trainerId = req.user.id;
    return this.assignmentsService.getTrainerClients(trainerId);
  }

  // Un Admin puede ver los clientes de cualquier trainer
  @Roles(Role.ADMIN)
  @Get('trainer/:trainerId/clients')
  async getClientsByTrainer(@Param('trainerId') trainerId: string) {
    return this.assignmentsService.getTrainerClients(trainerId);
  }

  @Roles(Role.ADMIN)
  @Delete(':trainerId/:clientId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async unassignClient(
    @Param('trainerId') trainerId: string,
    @Param('clientId') clientId: string,
  ) {
    await this.assignmentsService.unassignClient(trainerId, clientId);
  }
}
