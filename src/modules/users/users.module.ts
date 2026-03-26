import { Module } from '@nestjs/common';
import { UsersService } from './application/services/users.service';
import { PrismaUserRepository } from './infrastructure/repositories/prisma-user.repository';

@Module({
  providers: [
    UsersService,
    {
      provide: 'IUserRepository', // Regla 2: Dependency Injection y Repository Pattern
      useClass: PrismaUserRepository,
    },
  ],
  exports: [UsersService], // Exportamos para que AuthModule pueda usarlo
})
export class UsersModule {}
