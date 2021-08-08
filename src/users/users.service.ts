import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  async create(createUserDto: CreateUserDto): Promise<number> {
    return 1;
  }

  async findAll(): Promise<User[]> {
    return [];
  }

  findOne(id: number): Promise<User> {
    return null;
  }
}
