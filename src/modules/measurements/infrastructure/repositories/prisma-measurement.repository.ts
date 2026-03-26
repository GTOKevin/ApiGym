import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import type { IMeasurementRepository } from '../../domain/interfaces/measurement.repository.interface';
import { Measurement } from '../../domain/entities/measurement.entity';

@Injectable()
export class PrismaMeasurementRepository implements IMeasurementRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Omit<Measurement, 'id' | 'createdAt'>): Promise<Measurement> {
    const measurement = await this.prisma.measurement.create({
      data: {
        userId: data.userId,
        trainerId: data.trainerId,
        date: data.date,
        weightKg: data.weightKg,
        bodyFatPct: data.bodyFatPct,
        muscleMassKg: data.muscleMassKg,
        chestCm: data.chestCm,
        armsCm: data.armsCm,
        waistCm: data.waistCm,
        legsCm: data.legsCm,
      },
    });
    return this.mapToEntity(measurement);
  }

  async findByUser(userId: string): Promise<Measurement[]> {
    const measurements = await this.prisma.measurement.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });
    return measurements.map(this.mapToEntity);
  }

  async findById(id: string): Promise<Measurement | null> {
    const measurement = await this.prisma.measurement.findUnique({
      where: { id },
    });
    return measurement ? this.mapToEntity(measurement) : null;
  }

  private mapToEntity(prismaMeasurement: any): Measurement {
    return {
      id: prismaMeasurement.id,
      userId: prismaMeasurement.userId,
      trainerId: prismaMeasurement.trainerId,
      date: prismaMeasurement.date,
      weightKg: Number(prismaMeasurement.weightKg),
      bodyFatPct: prismaMeasurement.bodyFatPct ? Number(prismaMeasurement.bodyFatPct) : null,
      muscleMassKg: prismaMeasurement.muscleMassKg ? Number(prismaMeasurement.muscleMassKg) : null,
      chestCm: prismaMeasurement.chestCm ? Number(prismaMeasurement.chestCm) : null,
      armsCm: prismaMeasurement.armsCm ? Number(prismaMeasurement.armsCm) : null,
      waistCm: prismaMeasurement.waistCm ? Number(prismaMeasurement.waistCm) : null,
      legsCm: prismaMeasurement.legsCm ? Number(prismaMeasurement.legsCm) : null,
      createdAt: prismaMeasurement.createdAt,
    };
  }
}
