import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import * as dotenv from 'dotenv';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserPayload } from '../models/user-payload';
import { UserFromJwt } from '../models/user-from-jwt';
dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_TOKEN,
    });
  }

  public async validate(payload: UserPayload): Promise<UserFromJwt> {
    return {
      id: payload['sub'],
      email: payload['email'],
      name: payload['name'],
    };
  }
}
