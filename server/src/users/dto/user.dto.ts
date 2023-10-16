import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({
    description: 'User email',
    example: 'w5jvA@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    description: 'User password',
    example: 'password',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
