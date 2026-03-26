import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { SyncDataDto } from '../dto/sync-data.dto';
import { DayOfWeek, MealType } from '@prisma/client';

@Injectable()
export class SyncService {
  constructor(private readonly prisma: PrismaService) {}

  async syncData(trainerId: string, dto: SyncDataDto) {
    return this.prisma.$transaction(async (tx) => {
      let routinesCreated = 0;
      let measurementsCreated = 0;

      if (dto.routines && dto.routines.length > 0) {
        for (const routine of dto.routines) {
          await tx.routine.create({
            data: {
              trainerId,
              clientId: routine.clientId,
              date: routine.date ? new Date(routine.date) : null,
              dayOfWeek: routine.dayOfWeek as DayOfWeek,
              isTemplate: routine.isTemplate,
              notes: routine.notes,
              exercises: {
                create: routine.exercises.map((ex: any) => ({
                  exerciseId: ex.exerciseId,
                  sets: ex.sets,
                  reps: ex.reps,
                  weightKg: ex.weightKg,
                  restSeconds: ex.restSeconds,
                  orderIndex: ex.orderIndex,
                })),
              },
            },
          });
          routinesCreated++;
        }
      }

      if (dto.measurements && dto.measurements.length > 0) {
        for (const measurement of dto.measurements) {
          await tx.measurement.create({
            data: {
              userId: measurement.userId,
              trainerId,
              date: new Date(measurement.date),
              weightKg: measurement.weightKg,
              bodyFatPct: measurement.bodyFatPct,
              muscleMassKg: measurement.muscleMassKg,
              chestCm: measurement.chestCm,
              armsCm: measurement.armsCm,
              waistCm: measurement.waistCm,
              legsCm: measurement.legsCm,
            },
          });
          measurementsCreated++;
        }
      }

      return {
        success: true,
        synced: {
          routines: routinesCreated,
          measurements: measurementsCreated,
        },
      };
    });
  }
}
