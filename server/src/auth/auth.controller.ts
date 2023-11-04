import {
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  Body,
  HttpCode,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from '../users/dto/login-user.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Register new user' })
  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    return await this.authService.register(dto);
  }

  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Login user' })
  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: LoginUserDto) {
    const { email, password } = await this.authService.validateUser(
      dto.email,
      dto.password,
    );
    return await this.authService.login(email, password);
  }
}
