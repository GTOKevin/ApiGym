import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from '../../application/services/users.service';
import { UserQueryDto } from '../../application/dto/user-query.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Obtener lista paginada de usuarios con filtros' })
  @Get()
  async findAll(@Query() query: UserQueryDto) {
    const { page = 1, limit = 10, role, status, search } = query;
    const { data, total } = await this.usersService.findAll(page, limit, role, status, search);
    // Removemos la contraseña antes de enviarlo
    const safeData = data.map((user: any) => {
      const { passwordHash, ...rest } = user;
      return rest;
    });
    return new PaginatedResponseDto(safeData, total, page, limit);
  }
}
