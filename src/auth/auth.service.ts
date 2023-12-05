import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/services/users/users.service';
import { wrapResponse } from '../utils/wrapResponse';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email, pass) {
    const user = await this.usersService.findUserByName(email);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, email: user.email };
    console.log(user);
    return wrapResponse(
      {
        id: user.id,
        display_name: user.email,
        token: await this.jwtService.signAsync(payload),
        role: user.role,
        storeId: user.store?.id,
      },
      200,
      'OK',
      'Login successful',
    );
  }
}
