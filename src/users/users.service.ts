import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(body: CreateUserDto): Promise<number> {
    const user = new User();
    user.firstName = body.firstName;
    user.lastName = body.lastName;
    user.email = body.email;
    user.photoUrl = body.photoUrl;
    const response = await this.userRepository.save(user);
    return response.id;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: number): Promise<User> {
    return this.userRepository.findOne(id);
  }
}
