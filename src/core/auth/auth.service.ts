import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import * as dotenv from 'dotenv';
import { JwtService } from '@nestjs/jwt';
import { UserToken } from './models/user-token';
import { User } from '../../user/entities/user';
import { UserPayload } from './models/user-payload';
import { IUserService } from './../../user/interfaces/user-service.interface';
import { ICryptography } from '../infra/crypto/interfaces/cryptography.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: IUserService,
    private readonly jwtService: JwtService,
    private readonly cryptography: ICryptography,
  ) {}

  public async validateUser(email: string, password: string) {
    const user: User = await this.userService.findOneWithEspacificFildsByEmail(
      ['id', 'name', 'email', 'password'],
      email,
    );

    if (user) {
      const isPasswordValid = await this.cryptography.compare(
        password,
        user.password,
      );

      if (isPasswordValid) {
        return {
          id: user['id'],
          name: user['name'],
          email: user['email'],
        };
      }
    }

    throw new HttpException(
      'E-mail and/or Password incorrect',
      HttpStatus.BAD_REQUEST,
    );
  }

  public login(user: Express.User): UserToken {
    const payload: UserPayload = {
      sub: user['id'],
      name: user['name'],
      email: user['email'],
    };
    const jwtToken = this.jwtService.sign(payload, {
      secret: process.env.SECRET_TOKEN,
      expiresIn: '1d',
    });

    return {
      access_token: jwtToken,
    };
  }
}
