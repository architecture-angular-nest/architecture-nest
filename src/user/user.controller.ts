import { Body, Controller, Post, Res } from '@nestjs/common';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  public async create(
    @Body() createDto: CreateUserDto,
    @Res() res?: Response,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const savedEntity = await this.userService.createEntity(createDto);

      return res.status(201).send(savedEntity);
    } catch (error) {
      return res
        .status(error.status || 500)
        .send(
          error.status == 500 || !error.status
            ? { message: 'Internal Server Error' }
            : error,
        );
    }
  }
}
