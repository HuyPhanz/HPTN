import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }), // You can use other strategies like local or OAuth
  ],
  providers: [AuthService, UserService],
})
export class AuthModule {}
