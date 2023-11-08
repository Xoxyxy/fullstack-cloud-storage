import { CreateUserDto } from './../../src/users/dto/create-user.dto';
import { LoginUserDto } from './../../src/users/dto/login-user.dto';

export const mockDataForSuccessRegister: CreateUserDto = {
  email: 'test@test.com',
  fullName: 'test',
  password: 'test',
};

export const mockDataForSuccessLogin: LoginUserDto = {
  email: 'test@test.com',
  password: 'test',
};

export const mockDataForFailLogin: LoginUserDto = {
  email: 'test03945102983@test.com',
  password: 'test',
};
