import { DeepPartial, Store } from '../../utils/types';

export class UserDto {
  email: string;
  password: string;
}

export class UpdateUserDto {
  email: string;
  password: string;
  role: string;
  store: DeepPartial<Store>;
}
