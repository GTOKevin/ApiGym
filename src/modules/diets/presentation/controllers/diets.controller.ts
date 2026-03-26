import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { DietsService } from '../../application/services/diets.service';
import { CreateDietDto } from '../../application/dto/create-diet.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('diets')
export class DietsController {
  constructor(private readonly dietsService: DietsService) {}

  @Roles(Role.TRAINER, Role.ADMIN)
  @Post()
  create(@Request() req: any, @Body() createDietDto: CreateDietDto) {
    const trainerId = req.user.userId;
    return this.dietsService.createDiet(trainerId, createDietDto);
  }

  @Roles(Role.USER, Role.TRAINER, Role.ADMIN)
  @Get('my-diets')
  getMyDiets(@Request() req: any) {
    return this.dietsService.getClientDiets(req.user.userId);
  }

  @Roles(Role.USER, Role.TRAINER, Role.ADMIN)
  @Get('my-diets/active')
  getMyActiveDiet(@Request() req: any) {
    return this.dietsService.getClientActiveDiet(req.user.userId);
  }

  @Roles(Role.TRAINER, Role.ADMIN)
  @Get('user/:userId')
  getUserDiets(@Param('userId') userId: string) {
    return this.dietsService.getClientDiets(userId);
  }
}
