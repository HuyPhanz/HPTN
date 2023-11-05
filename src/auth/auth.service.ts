import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = this.userService.getUserByUsername(username);

    if (user && user.password === password) {
      return user;
    }

    return null;
  }
}
