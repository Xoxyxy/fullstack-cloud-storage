import {
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from '../users/users.service';
import { UserDto } from '../users/dto/user.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UsersService) {}

  @UsePipes(new ValidationPipe())
  @Post('register')
  async register(@Body() dto: UserDto) {
    if (await this.userService.findByEmail(dto.email)) {
      throw new BadRequestException(
        `User with ${dto.email} email already exists`,
      );
    }
    return this.userService.create(dto);
  }
}
