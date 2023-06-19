import { User } from './../../user/entities/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { UserService } from './../../user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  public async validateCompany(email: string, password: string) {
    const company: User = await this.userService.findOne({ where: { email } });

    if (company) {
      const isPasswordValid = await bcrypt.compare(password, company.password);

      if (isPasswordValid) {
        return {
          id: company['id'],
          name: company['name'],
          email: company['email'],
        };
      }
    }

    throw new HttpException(
      'E-mail and/or Password incorrect',
      HttpStatus.BAD_REQUEST,
    );
  }
}
