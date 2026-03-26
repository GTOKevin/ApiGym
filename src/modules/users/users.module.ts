import { Module } from '@nestjs/common';
import { UsersService } from './application/services/users.service';
import { PrismaUserRepository } from './infrastructure/repositories/prisma-user.repository';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { UsersController } from './presentation/controllers/users.controller';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
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
