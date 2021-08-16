import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
const path = require('path');
import { nanoid } from 'nanoid';
const sharp = require('sharp');

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  private async saveCroppedPhoto(photo: Express.Multer.File): Promise<string> {
    const fileNameParts = photo.originalname.split('.');
    const fileExt = fileNameParts[fileNameParts.length - 1];
    const fileName = path.join(__dirname, `../../media/${nanoid()}.${fileExt}`);
    const res = await sharp(photo.buffer)
      .resize({ width: 200, height: 200, position: 'center' })
      .toFile(fileName);
    if (!res) {
      throw new ServiceUnavailableException();
    }
    return fileName;
  }

  async create(
    body: CreateUserDto,
    photo: Express.Multer.File,
  ): Promise<number> {
    const user = new User();
    user.firstName = body.firstName;
    user.lastName = body.lastName;
    user.email = body.email;
    const savedPhotoPath = await this.saveCroppedPhoto(photo);
    user.photoUrl = savedPhotoPath;
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
