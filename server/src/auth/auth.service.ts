import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcrypt';
import { UsersService } from '../users/users.service';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

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
}
