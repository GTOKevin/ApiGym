import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './common/prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { AssignmentsModule } from './modules/assignments/assignments.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ExercisesModule } from './modules/exercises/exercises.module';
import { RoutinesModule } from './modules/routines/routines.module';
import { MeasurementsModule } from './modules/measurements/measurements.module';
import { DietsModule } from './modules/diets/diets.module';
import { SyncModule } from './modules/sync/sync.module';
import { ReportsModule } from './modules/reports/reports.module';

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
    ExercisesModule,
    RoutinesModule,
    MeasurementsModule,
    DietsModule,
    SyncModule,
    ReportsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
