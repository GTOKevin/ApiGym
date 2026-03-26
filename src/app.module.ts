import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './common/prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { AssignmentsModule } from './modules/assignments/assignments.module';
import { PaymentsModule } from './modules/payments/payments.module';

@Module({
  imports: [
    // Global Config Module (Clean Architecture Rule 4)
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Global Prisma Module
    PrismaModule,
    // Feature Modules
    UsersModule,
    AuthModule,
    SubscriptionsModule,
    AssignmentsModule,
    PaymentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
