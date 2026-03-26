import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardStats() {
    const totalUsers = await this.prisma.user.count({
      where: { role: 'USER' }
    });

    const activeSubscriptions = await this.prisma.userSubscription.count({
      where: { status: 'ACTIVE' }
    });

    const revenueResult = await this.prisma.payment.aggregate({
      where: { status: 'COMPLETED' },
      _sum: { amount: true }
    });

    return {
      totalUsers,
      activeSubscriptions,
      totalRevenue: revenueResult._sum.amount || 0,
    };
  }
}
