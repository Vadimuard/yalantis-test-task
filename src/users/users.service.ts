import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { nanoid } from 'nanoid';
import { FindUserDto } from './dto/find-user.dto';
import { Repository } from 'typeorm';
const path = require('path');
const fs = require('fs/promises');
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
    const savedPhotoPath = await this.saveCroppedPhoto(photo);
    const user = new User(
      body.firstName,
      body.lastName,
      body.email,
      savedPhotoPath,
    );
    const response = await this.userRepository.save(user);
    if (!response) {
      throw new ConflictException();
    }
    return response.id;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  private async readPhoto(fileName: string): Promise<Buffer> {
    const img = await fs.readFile(fileName);
    if (!img) {
      console.dir(
        'Error: profile picture of existing user does not exist on filesystem',
      );
      throw new InternalServerErrorException('User`s photo not found');
    }
    return img;
  }

  async findOne(id: number): Promise<FindUserDto> {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException();
    }
    const { photoUrl } = user;
    const photo = await this.readPhoto(photoUrl);
    const userWithPhoto = new FindUserDto(
      user.id,
      user.firstName,
      user.lastName,
      user.email,
      photo,
    );
    return userWithPhoto;
  }
}
