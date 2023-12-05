import {ButtonType} from "antd/lib/button";
import React from "react";
import {UploadFile} from "antd";

export interface ITableResponse<T> {
  data: T;
  current_page: number;
  total: number;
  per_page?: number;
}

export interface CommonReduxAction {
  type: string;
}

export interface CommonReactProps {
  children: React.ReactNode;
}

export interface ISettingId {
  _id?: string;
  themes?: string;
  location?: string;
  region?: string;
  language?: string;
  referCode?: string;
}

export enum IAccountRole {
  STAFF = "staff",
  ADMIN = "admin",
  STORE = "store",
}

export enum IState {
  INACTIVE,
  ACTIVE,
  DELETED,
}

export interface IUserLogin {
  id?: string | number;
  _id?: string;
  fullName?: string;
  state?: IState;
  email?: string;
  dateOfBirth?: string;
  positionId?: number;
  avatar?: string;
  personId?: number;
  address?: string;
  phoneNumber?: string;
  role?: {
    id?: IAccountRole;
    roleName?: string;
  };
  phoneNumberRelative?: string;
  baseSalary?: number;
  manageSalary?: number;
  gender?: string;
  groups?: any;
  data?: any;
  userInfo: any;
}

export interface IProfile {
  _id?: string;
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  phone?: string;
  location?: string;
  website?: string;
  facebook?: string;
  twitter?: string;
  avatar?: string;
  newEmail?: string;
}

export interface IAccountInfo {
  display_name?: string;
  role?: IAccountRole;
  storeId?: number;
  token?: string;
  avatar?: string;
  id?: number;
  user?: IUserLogin;
  accessToken?: string;
  refreshToken?: string;
  isConfirmed?: boolean;
  dataProfile?: IProfile;
  syncData?: any;
}

export interface ICoordinates {
  latitude: number;
  longitude: number;
}

export interface ICategory {
  id: number;
  name: string;
}

export interface INeighbor {
  id: number;
  name: string;
}

export interface ISocialLink {
  platform: string;
  url: string;
}

export interface IPartner {
  id: number;
  name: string;
  address: string;
  logo: string;
  category: ICategory;
  neighbor: INeighbor;
  email: string;
  password: string;
  phoneNumber: string | number;
  owner: string | number;
  coordinates: ICoordinates;
  socialLink: ISocialLink[];
  banners: string[];
  introduction: {
    title: string;
    subTitle: string;
    content: string;
  };
}

export interface ICustomer {
  key?: React.Key;
  no?: number;
  fullName: string;
  email?: string;
  phoneNumber: string;
  createDate?: string;
  totalPoint: number;
  checkedIn: number;
  purchased: number;
  status?: boolean;
}
export interface IEventParticipant {
  key: React.Key;
  id: number;
  avatar?: string;
  fullname: string;
  email: string;
  phone: string;
  total_point: number;
  CheckIn: number;
  Purchase: number;
  top: number;
}

export interface IPartnerForm {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  category_id?: number[];
  owner?: string;
  state_id?: number;
  address?: string;
  logo?: UploadFile;
  instagram?: string;
  tiktok?: string;
  banner?: UploadFile[];
  introduction_title?: string;
  introduction?: string;
  lat?: string;
  lon?: string;
  user?: any;
  event?: any;
}

export interface IFilterGroupProps {
  titleTooltipSearch?: string;
  haveInputSearch: boolean;
  onSearch: (value: string) => void;
  mainFilterText?: string | null;
  placeholderSearch?: string;
  listSelectFilter?: {
    defaultValue: string | null;
    placeholder: string;
    onChange: (value: any) => void;
    data: {
      value: string;
      label: string;
    }[];
  }[];
  listButton?: {
    title: string | undefined;
    startIcon?: React.ReactNode;
    type?: "import" | "add" | "delete" | string;
    // endIcon?: React.ReactNode;
    onClick: () => void;
    isDisabled?: boolean;
    isLoading?: boolean;
  }[];
}

export interface IfilterGroupProps {
  haveInputSearch: boolean;
  onSearch: (value: string) => void;
  mainFilterText?: string | null;
  placeholderSearch?: string;
  listSelectFilter?: {
    defaultValue: string | null;
    placeholder: string;
    onChange: (value: any) => void;
    data: {
      value: string;
      label: string;
    }[];
  }[];
  listButton?: {
    title: string | undefined;
    startIcon?: React.ReactNode;
    type?: ButtonType;
    // endIcon?: React.ReactNode;
    onClick: () => void;
    isDisabled?: boolean;
    isLoading?: boolean;
  }[];
}

export interface IResponseDataAccounts {
  id?: number;
  email?: string;
  password?: string;
  role?: string;
  store?: any;
  profile?: any;
}

export interface IEventPrize {
  image?: UploadFile;
  image_data?: any;
  description?: string;
  name?: string;
  no?: number;
  event_id?: number;
  id?: number;
  embed?: string;
}

export interface IConfirmModal {
  type: "Delete" | "LogOut";
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  confirmAction: () => void;
  isLoading?: boolean;
}
