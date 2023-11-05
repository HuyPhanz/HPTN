import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  listUsers() {
    return this.userService.getUsers();
  }

  @Post()
  addUser(@Body() user: { username: string, password: string }) {
    return this.userService.createUser(user);
  }

  @Put(':id')
  editUser(@Param('id') id: string, @Body() user: { username: string, password: string }) {
    return this.userService.editUser(id, user);
  }
}
