import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IMeasurementRepository } from '../../domain/interfaces/measurement.repository.interface';
import { CreateMeasurementDto } from '../dto/create-measurement.dto';

@Injectable()
export class MeasurementsService {
  constructor(
    @Inject('IMeasurementRepository')
    private readonly measurementRepository: IMeasurementRepository,
  ) {}

  async create(trainerId: string, dto: CreateMeasurementDto) {
    return this.measurementRepository.create({
      userId: dto.userId,
      trainerId,
      date: new Date(dto.date),
      weightKg: dto.weightKg,
      bodyFatPct: dto.bodyFatPct || null,
      muscleMassKg: dto.muscleMassKg || null,
      chestCm: dto.chestCm || null,
      armsCm: dto.armsCm || null,
      waistCm: dto.waistCm || null,
      legsCm: dto.legsCm || null,
    });
  }

  async findByUser(userId: string) {
    return this.measurementRepository.findByUser(userId);
  }

  async findOne(id: string) {
    const measurement = await this.measurementRepository.findById(id);
    if (!measurement) {
      throw new NotFoundException(`Measurement with ID ${id} not found`);
    }
    return measurement;
  }
}
