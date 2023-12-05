import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../typeorm/entities/User';
import {
  CreateUserParams,
  CreateUserProfileParams,
  UpdateUserParams,
} from '../../../utils/types';
import { Profile } from '../../../typeorm/entities/Profile';
import { wrapResponse, wrapResponseMeta } from '../../../utils/wrapResponse';
import { Store } from '../../../typeorm/entities/Store';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
    @InjectRepository(Store) private storeRepository: Repository<Store>,
  ) {}

  async getUserWithMeta(page: number, perpage: number) {
    const take = perpage || 10;
    const skip = (page - 1) * perpage;
    const [result, total] = await this.userRepository.findAndCount({
      take: take,
      skip: skip,
      relations: ['store'],
    });

    return wrapResponseMeta(result, 200, 'OK', 'success', {
      current_page: page,
      total: total,
    });
  }

  findUserByName(email: string) {
    return this.userRepository.findOne({
      where: { email },
      relations: ['store'],
    });
  }

  findUsers() {
    return this.userRepository.find({ relations: ['profile', 'store'] });
  }

  createUser(userDetails: CreateUserParams) {
    const newUser = this.userRepository.create({
      ...userDetails,
      createdAt: new Date(),
    });
    return wrapResponse(
      this.userRepository.save(newUser),
      200,
      'OK',
      'Success',
    );
  }

  async updateUser(id: number, updateUserDetails: UpdateUserParams) {
    try {
      const user = await this.userRepository.findOneBy({ id });
      await this.userRepository.update({ id }, { ...updateUserDetails });
      if (updateUserDetails.store) {
        const store = await this.storeRepository.findOneBy({
          id: updateUserDetails.store.id,
        });
        await this.storeRepository.save({ ...store, user: user });
      }
      return wrapResponse(user, HttpStatus.OK, 'Ok', 'Success');
    } catch (e) {
      console.log(e);
      throw new HttpException('Error!', HttpStatus.BAD_REQUEST);
      return wrapResponse({}, HttpStatus.BAD_REQUEST, 'Error', 'Error');
    }
  }

  async deleteUser(id: number) {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: ['store'],
      });
      const store = await this.storeRepository.findOneBy({ id: user.store.id });
      await this.storeRepository.save({ ...store, user: null });
      await this.userRepository.delete({ id });
      return wrapResponse(user, 200, 'OK', 'Success');
    } catch (e) {
      console.log(e);
    }
  }

  async createProfile(
    id: number,
    createUserProfileParams: CreateUserProfileParams,
  ) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user)
      throw new HttpException(
        'User not found. Cannot create profile!',
        HttpStatus.BAD_REQUEST,
      );
    const newProfile = this.profileRepository.create(createUserProfileParams);
    const savedProfile = await this.profileRepository.save(newProfile);
    user.profile = savedProfile;
    return this.userRepository.save(user);
  }
}
