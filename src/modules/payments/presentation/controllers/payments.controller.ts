import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { Role, PaymentMethod } from '@prisma/client';
import { IsUUID, IsNumber, Min, IsEnum } from 'class-validator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { PaymentsService } from '../../application/services/payments.service';
import { Roles } from 'src/common/decorators/roles.decorator';

class RegisterManualPaymentDto {
  @IsUUID()
  userId: string;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Roles(Role.ADMIN)
  @Post('manual')
  async registerManualPayment(@Body() dto: RegisterManualPaymentDto, @Request() req: any) {
    const adminId = req.user.id;
    return this.paymentsService.registerManualPayment(
      dto.userId,
      adminId,
      dto.amount,
      dto.paymentMethod,
    );
  }

  @Roles(Role.USER)
  @Get('my-history')
  async getMyPayments(@Request() req: any) {
    return this.paymentsService.getMyPayments(req.user.id);
  }
}
