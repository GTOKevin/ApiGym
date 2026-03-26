import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../../../common/prisma/prisma.service';
import type { ITrainerClientRepository } from '../../domain/interfaces/trainer-client.repository.interface';
import { TrainerClient } from '../../domain/entities/trainer-client.entity';

@Injectable()
export class PrismaTrainerClientRepository implements ITrainerClientRepository {
  constructor(private readonly prisma: PrismaService) {}

  async assignClientToTrainer(trainerId: string, clientId: string): Promise<TrainerClient> {
    try {
      const assignment = await this.prisma.trainerClient.create({
        data: {
          trainerId,
          clientId,
          isActive: true,
        },
      });
      return this.mapToDomain(assignment);
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictException('Este cliente ya está asignado a este entrenador.');
      }
      throw error;
    }
  }

  async findClientsByTrainerId(trainerId: string): Promise<any[]> {
    const assignments = await this.prisma.trainerClient.findMany({
      where: { trainerId, isActive: true },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profileImageUrl: true, // Esto ya existe gracias a que regeneramos Prisma Client
          },
        },
      },
    });
    return assignments.map((a) => ({
      assignmentId: a.id,
      assignedAt: a.assignedAt,
      client: a.client, // client sí existe porque lo incluimos en la consulta arriba
    }));
  }

  async unassignClient(trainerId: string, clientId: string): Promise<void> {
    await this.prisma.trainerClient.update({
      where: {
        trainerId_clientId: {
          trainerId,
          clientId,
        },
      },
      data: { isActive: false },
    });
  }

  async checkIfAssigned(trainerId: string, clientId: string): Promise<boolean> {
    const assignment = await this.prisma.trainerClient.findUnique({
      where: {
        trainerId_clientId: {
          trainerId,
          clientId,
        },
      },
    });
    return !!assignment && assignment.isActive;
  }

  private mapToDomain(record: any): TrainerClient {
    return new TrainerClient(
      record.id,
      record.trainerId,
      record.clientId,
      record.isActive,
      record.assignedAt,
    );
  }
}
