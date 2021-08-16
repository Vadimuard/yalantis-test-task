import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { FindUserDto } from './dto/find-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseInterceptors(FileInterceptor('photo'))
  async create(
    @Body() body: CreateUserDto,
    @UploadedFile() photo: Express.Multer.File,
  ): Promise<number> {
    if (!photo) {
      throw new BadRequestException('Photo field should not be empty');
    }
    return await this.usersService.create(body, photo);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseIntPipe()) id: string,
  ): Promise<FindUserDto> {
    return await this.usersService.findOne(+id);
  }
}
