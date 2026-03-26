import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { SyncService } from '../../application/services/sync.service';
import { SyncDataDto } from '../../application/dto/sync-data.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Roles(Role.TRAINER, Role.ADMIN)
  @Post()
  syncOfflineData(@Request() req: any, @Body() syncDataDto: SyncDataDto) {
    const trainerId = req.user.userId;
    return this.syncService.syncData(trainerId, syncDataDto);
  }
}
