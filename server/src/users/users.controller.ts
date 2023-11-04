import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { UserId } from '../decorators/user-id.decorator';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Get current user' })
  @Get('me')
  async getMe(@UserId() userId: number) {
    return await this.usersService.findById(userId);
  }
}
