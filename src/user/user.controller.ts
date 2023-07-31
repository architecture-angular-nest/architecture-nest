import { Body, Controller, Post, Res } from '@nestjs/common';

import { Response } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { CurrentUser } from 'src/core/auth/decorators/current-user.decorator';
import { IUserService } from './interfaces/user-service.interface';

@Controller('user')
export class UserController {
  constructor(private readonly userService: IUserService) {}

  @Post()
  public async create(
    @Body() createDto: CreateUserDto,
    @Res() res?: Response,
    @CurrentUser() user?: Express.User,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const savedEntity = await this.userService.createEntity(createDto, user);

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
