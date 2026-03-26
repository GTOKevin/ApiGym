import { IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PaymentMethod, PaymentStatus } from '@prisma/client';

export class PaymentQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: PaymentStatus, description: 'Filtrar por estado del pago' })
  @IsEnum(PaymentStatus)
  @IsOptional()
  status?: PaymentStatus;

  @ApiPropertyOptional({ enum: PaymentMethod, description: 'Filtrar por método de pago' })
  @IsEnum(PaymentMethod)
  @IsOptional()
  paymentMethod?: PaymentMethod;
}
