import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { UsersService } from '../users/users.service';
import { UserEntity } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserEntity> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException(
        `User with email ${email} does not exist`,
      );
    }

    const isCorrectPassword = await compare(password, user.password);
    if (!isCorrectPassword) {
      throw new UnauthorizedException(
        `Incorrect password for user with email ${email}`,
      );
    }

    return user;
  }

  async register(dto: CreateUserDto) {
    if (await this.userService.findByEmail(dto.email)) {
      throw new BadRequestException(
        `User with ${dto.email} email already exists`,
      );
    }
    return await this.userService.create(dto);
  }

  async login(email: string, password: string) {
    return {
      access_token: await this.jwtService.signAsync({ email, password }),
    };
  }
}
