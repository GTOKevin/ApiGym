import { Measurement } from '../entities/measurement.entity';

export interface IMeasurementRepository {
  create(data: Omit<Measurement, 'id' | 'createdAt'>): Promise<Measurement>;
  findByUser(userId: string): Promise<Measurement[]>;
  findById(id: string): Promise<Measurement | null>;
}
