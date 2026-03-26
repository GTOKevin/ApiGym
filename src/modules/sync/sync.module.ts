import { Module } from '@nestjs/common';
import { SyncService } from './application/services/sync.service';
import { SyncController } from './presentation/controllers/sync.controller';
import { PrismaModule } from 'src/common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SyncController],
  providers: [SyncService],
})
export class SyncModule {}
