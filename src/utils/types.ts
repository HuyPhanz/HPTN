export type DeepPartial<T> = { [P in keyof T]?: DeepPartial<T[P]> };

export type CreateUserParams = {
  email: string;
  password: string;
};

export type UpdateUserParams = {
  email: string;
  password: string;
  role: string;
  store: DeepPartial<Store>;
};

export type CreateUserProfileParams = {
  firstName: string;
  lastName: string;
  age: number;
  phoneNumber;
};

interface IMetadata {
  // Define metadata properties if needed
}

export interface IResponseDTO<T> {
  status: number | boolean;
  errorCode: string;
  message?: string;
  meta?: IMetadata;
  data?: T;
}

export interface IResponseDTOWithMeta<T> {
  status: number | boolean;
  errorCode: string;
  message?: string;
  meta?: IMetadata;
  data?: {
    current_page: number;
    data: T;
    total: number;
  };
}

export type EventProduct = {
  id: number;
  quantity: number;
  event: number;
  product: number;
};

export type Event = {
  id: number;
  name: string;
  status: string;
  createdAt: Date;
  description: string;
  content: string;
  start_date: Date;
  end_date: Date;
};

export type CreateEventDto = {
  name: string;
  status: string;
  content: string;
  start_date: Date;
  end_date: Date;
  description: string;
};

export type UpdateEventDto = {
  name: string;
  status: string;
  content: string;
  start_date: Date;
  end_date: Date;
  description: string;
};

export type Product = {
  id: number;
  name: string;
  price: number;
  createdAt: Date;
  description: string;
  events: DeepPartial<Event[]>;
  category: DeepPartial<Category>;
  store: DeepPartial<Store[]>;
};

export type CreateProductDto = {
  name: string;
  price: number;
  description?: string;
  category: DeepPartial<Category>;
  store: DeepPartial<Store[]>;
  event: DeepPartial<Event[]>;
};

export type UpdateProductDto = {
  name: string;
  price: number;
  description: string;
  category: DeepPartial<Category>;
  store: DeepPartial<Store[]>;
  event: DeepPartial<Event[]>;
};

export type Store = {
  id: number;
  name: string;
  address: string;
  createdAt: Date;
  description: string;
  category: DeepPartial<Category>;
  products: DeepPartial<Product[]>;
};

export type CreateStoreDto = {
  name: string;
  address: string;
  description?: string;
  category: DeepPartial<Category>;
  products: DeepPartial<Product[]>;
};

export type UpdateStoreDto = {
  name: string;
  address: string;
  description: string;
  category: DeepPartial<Category>;
  products: DeepPartial<Product[]>;
};

export type Category = {
  id: number;
  name: string;
  createdAt: Date;
  description: string;
  stores: DeepPartial<Store[]>;
  products: DeepPartial<Product[]>;
};

export type CreateCategoryDto = {
  name: string;
  description: string;
};

export type UpdateCategoryDto = {
  name: string;
  description: string;
};
