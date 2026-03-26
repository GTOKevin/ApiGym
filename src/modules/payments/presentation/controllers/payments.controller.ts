import { Controller, Post, Body, UseGuards, Request, Get, HttpCode, HttpStatus, Headers, Query } from '@nestjs/common';
import { Role, PaymentMethod } from '@prisma/client';
import { IsUUID, IsNumber, Min, IsEnum } from 'class-validator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { PaymentsService } from '../../application/services/payments.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentQueryDto } from '../../application/dto/payment-query.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';

class RegisterManualPaymentDto {
  @IsUUID()
  userId: string;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;
}

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Registrar un pago manual (Efectivo/Transferencia)' })
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

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  @ApiOperation({ summary: 'Obtener historial de pagos del usuario logueado' })
  @Get('my-history')
  async getMyPayments(@Request() req: any, @Query() query: PaymentQueryDto) {
    const { page = 1, limit = 10, status } = query;
    const { data, total } = await this.paymentsService.getMyPayments(req.user.id, page, limit, status);
    return new PaginatedResponseDto(data, total, page, limit);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Obtener historial de todos los pagos (Admin)' })
  @Get()
  async getAllPayments(@Query() query: PaymentQueryDto) {
    const { page = 1, limit = 10, status, paymentMethod } = query;
    const { data, total } = await this.paymentsService.getAllPayments(page, limit, status, paymentMethod);
    return new PaginatedResponseDto(data, total, page, limit);
  }

  // Endpoint público para Webhooks (No lleva JwtAuthGuard)
  @ApiOperation({ summary: 'Webhook para recibir notificaciones de Culqi/MercadoPago' })
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handlePaymentWebhook(@Body() body: any, @Headers() headers: any) {
    console.log('Webhook recibido de proveedor de pagos');
    
    try {
      await this.paymentsService.processWebhookEvent(body, headers);
      return { received: true };
    } catch (error) {
      console.error('Error procesando webhook:', error.message);
      // Retornamos OK para evitar reintentos infinitos si el error no es recuperable,
      // pero en un entorno real se podría retornar 400 en caso de firma inválida.
      return { received: true, error: error.message };
    }
  }
}
