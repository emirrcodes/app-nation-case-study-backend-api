import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RequestWithUser } from 'src/common/types/request-with-user';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  @Get('all')
  @Roles('ADMIN')
  getAllUsers(@Req() req: RequestWithUser) {
    const user = req.user;
    return {
      message: 'Bu liste sadece adminler için.',
      requestedBy: user,
    };
  }
}
