import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Role, UserStatus } from '@prisma/client';

export class UserQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: Role, description: 'Filtrar por rol de usuario' })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @ApiPropertyOptional({ enum: UserStatus, description: 'Filtrar por estado del usuario' })
  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus;

  @ApiPropertyOptional({ description: 'Buscar por nombre, apellido o email' })
  @IsString()
  @IsOptional()
  search?: string;
}
