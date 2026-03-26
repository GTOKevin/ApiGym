export class TrainerClient {
  constructor(
    public readonly id: string,
    public readonly trainerId: string,
    public readonly clientId: string,
    public readonly isActive: boolean,
    public readonly assignedAt: Date,
  ) {}
}
