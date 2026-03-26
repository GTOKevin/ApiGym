import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { ITrainerClientRepository } from '../../domain/interfaces/trainer-client.repository.interface';
import { TrainerClient } from '../../domain/entities/trainer-client.entity';

@Injectable()
export class AssignmentsService {
  constructor(
    @Inject('ITrainerClientRepository')
    private readonly assignmentRepository: ITrainerClientRepository,
  ) {}

  async assignClientToTrainer(trainerId: string, clientId: string): Promise<TrainerClient> {
    // Aquí se podrían agregar validaciones extra (ej. verificar que los IDs existen)
    return this.assignmentRepository.assignClientToTrainer(trainerId, clientId);
  }

  async getTrainerClients(trainerId: string): Promise<any[]> {
    return this.assignmentRepository.findClientsByTrainerId(trainerId);
  }

  async unassignClient(trainerId: string, clientId: string): Promise<void> {
    const isAssigned = await this.assignmentRepository.checkIfAssigned(trainerId, clientId);
    if (!isAssigned) {
      throw new NotFoundException('La asignación no existe o ya está inactiva');
    }
    return this.assignmentRepository.unassignClient(trainerId, clientId);
  }
}
