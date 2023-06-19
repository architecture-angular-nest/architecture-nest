import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';

import { Response } from 'express';
import { AuthService } from './auth.service';
import { UserToken } from './models/user-token';
import { AuthRequest } from './models/auth-request';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { IsPublic } from './decorators/is-public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @IsPublic()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  public async login(@Req() req: AuthRequest, @Res() res: Response) {
    try {
      const loginResponse: UserToken = this.authService.login(req.user);

      return res.status(200).send(loginResponse);
    } catch (error) {
      return res
        .status(error?.status || 500)
        .send(
          error?.status == 500 || !error?.status
            ? { message: 'Internal Server Error' }
            : error,
        );
    }
  }
}
