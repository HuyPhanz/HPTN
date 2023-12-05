import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UserDto, UpdateUserDto } from '../../dtos/User.dto';
import { UsersService } from '../../services/users/users.service';
import { CreateUserProfileDto } from '../../dtos/Profile.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('')
  getUsersWithMeta(
    @Query('page') page: number = 1,
    @Query('perpage') perPage: number = 10,
  ) {
    return this.userService.getUserWithMeta(page, perPage);
  }

  @Get('/all')
  getUsers() {
    return this.userService.findUsers();
  }

  @Post()
  createUser(@Body() createUserDto: UserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Patch(':id')
  updateUserById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  deleteUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }

  @Post(':id/profiles')
  createUserProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() createUserProfileDto: CreateUserProfileDto,
  ) {
    return this.userService.createProfile(id, createUserProfileDto);
  }
}
