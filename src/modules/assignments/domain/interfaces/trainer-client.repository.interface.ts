import { TrainerClient } from '../entities/trainer-client.entity';

export interface ITrainerClientRepository {
  assignClientToTrainer(trainerId: string, clientId: string): Promise<TrainerClient>;
  findClientsByTrainerId(trainerId: string): Promise<any[]>; // Incluye datos del cliente
  unassignClient(trainerId: string, clientId: string): Promise<void>;
  checkIfAssigned(trainerId: string, clientId: string): Promise<boolean>;
}
