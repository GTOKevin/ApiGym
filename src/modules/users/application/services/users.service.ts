import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import { User } from '../../domain/entities/user.entity';
import { Role, UserStatus } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async findAll(page: number = 1, limit: number = 10, role?: Role, status?: UserStatus, search?: string) {
    const skip = (page - 1) * limit;
    return this.userRepository.findAll(skip, limit, role, status, search);
  }

  // Los métodos create, update se implementarán junto con Auth y DTOs
}
