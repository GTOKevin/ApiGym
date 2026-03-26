import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IDietRepository } from '../../domain/interfaces/diet.repository.interface';
import { CreateDietDto } from '../dto/create-diet.dto';

@Injectable()
export class DietsService {
  constructor(
    @Inject('IDietRepository')
    private readonly dietRepository: IDietRepository,
  ) {}

  async createDiet(trainerId: string, dto: CreateDietDto) {
    return this.dietRepository.createWithMeals({
      trainerId,
      clientId: dto.clientId,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
      notes: dto.notes,
      meals: dto.meals,
    });
  }

  async getClientDiets(clientId: string) {
    return this.dietRepository.findByClient(clientId);
  }

  async getClientActiveDiet(clientId: string) {
    return this.dietRepository.findActiveByClient(clientId);
  }
}
