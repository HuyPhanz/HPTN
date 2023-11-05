import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  private users = [];
  private userIdCounter = 1;

  getUsers() {
    return this.users;
  }

  createUser(user: { username: string; password: string }) {
    const newUser = { id: this.userIdCounter, ...user };
    this.users.push(newUser);
    this.userIdCounter++;
    return newUser;
  }

  getUserById(id: string) {
    return this.users.find((user) => user.id === parseInt(id, 10));
  }

  editUser(id: string, user: { username: string; password: string }) {
    const existingUser = this.getUserById(id);

    if (existingUser) {
      existingUser.username = user.username;
      existingUser.password = user.password;
      return existingUser;
    } else {
      return null; // User not found
    }
  }
}
