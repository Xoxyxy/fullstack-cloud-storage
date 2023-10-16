import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { genSalt, hash } from 'bcrypt';
import { UserEntity } from './entities/user.entity';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.usersRepository.findOneBy({ email });
  }

  async findById(id: number): Promise<UserEntity> {
    return this.usersRepository.findOneBy({ id });
  }

  async create(dto: UserDto): Promise<UserEntity> {
    const salt = await genSalt(10);
    const newUser = await this.usersRepository.save({
      ...dto,
      password: await hash(dto.password, salt),
    });
    return newUser;
  }
}
