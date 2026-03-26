import { Module } from '@nestjs/common';
import { DietsService } from './application/services/diets.service';
import { DietsController } from './presentation/controllers/diets.controller';
import { PrismaDietRepository } from './infrastructure/repositories/prisma-diet.repository';
import { PrismaModule } from 'src/common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DietsController],
  providers: [
    DietsService,
    {
      provide: 'IDietRepository',
      useClass: PrismaDietRepository,
    },
  ],
  exports: [DietsService],
})
export class DietsModule {}
