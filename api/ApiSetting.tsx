import {fetcher} from "./Fetcher";
import Constant from "@app/api/Constant";

export interface IBanbner {
  id: number | string;
  file_id: number | string;
  image_data: string;
}
export interface IBannerListResponse {
  id?: number;
  key?: string;
  value?: {
    description?: string;
    link?: string;
  };
  banner?: IBanbner[] | [];
}
export interface IBannerSettingResponse {
  total?: number;
  current_page?: string;
  data: IBannerListResponse[];
}

export interface IAboutUsResponse {
  id?: number;
  key?: string;
  value?: string | undefined;
  image_about?: IBanbner[] | [];
}
export interface IAboutUsValueResponse {
  description?: string;
  facebook?: string;
  instagram?: string;
  web?: string;
  tiktok?: string;
  distance?: number;
  status?: boolean | string;
}
export interface IContactData {
  phone_number?: boolean;
  email?: string;
  location?: string;
}
export interface ICreateAboutUs {
  description?: string;
}
function getWinShopAboutUs(): Promise<IAboutUsResponse[]> {
  return fetcher({
    url: Constant.API_PATH.GET_WIN_SHOP_ABOUTUS,
    method: "get",
  });
}
function editWinShopAboutUs(
  payload: IAboutUsValueResponse
): Promise<IAboutUsResponse[]> {
  return fetcher({
    url: Constant.API_PATH.POST_EDIT_WIN_SHOP_ABOUTUS,
    method: "post",
    data: payload,
  });
}

function editWinShopContactUs(
  payload: IAboutUsValueResponse
): Promise<IAboutUsResponse[]> {
  return fetcher({
    url: Constant.API_PATH.POST_EDIT_WIN_SHOP_CONTACT_US,
    method: "post",
    data: payload,
  });
}

function editWinShopDistance(
  payload: IAboutUsValueResponse
): Promise<IAboutUsResponse[]> {
  return fetcher({
    url: Constant.API_PATH.POST_EDIT_WIN_SHOP_DISTANCE,
    method: "post",
    data: payload,
  });
}

function postCreateBannerAboutUs(
  data: FormData
): Promise<{id: number; image_data: string}> {
  return fetcher({
    url: Constant.API_PATH.POST_BANNER_WIN_SHOP_ABOUTUS,
    method: "post",
    data: data,
    headers: {"content-type": "multipart/form-data"},
  });
}

function postUpdateBannerAboutUs(
  data: FormData
): Promise<{id: number; image_data: string}> {
  return fetcher({
    url: Constant.API_PATH.UPDATE_BANNER_WIN_SHOP_ABOUTUS,
    method: "post",
    data: data,
    headers: {"content-type": "multipart/form-data"},
  });
}
function deleteBannerAboutUs(id: number): Promise<any[]> {
  return fetcher({
    url: Constant.API_PATH.DELETE_BANNER_WIN_SHOP_ABOUTUS(id),
    method: "delete",
  });
}
function getDataTermServices(): Promise<IAboutUsResponse> {
  return fetcher({
    url: Constant.API_PATH.GET_TERM_SERVICES,
    method: "get",
  });
}
function createDataTermServices(data: FormData): Promise<IAboutUsResponse> {
  return fetcher({
    url: Constant.API_PATH.POST_TERM_SERVICES,
    method: "post",
    data: data,
    headers: {"content-type": "multipart/form-data"},
  });
}
function getDataContactHelp(): Promise<IAboutUsResponse> {
  return fetcher({
    url: Constant.API_PATH.GET_DATA_CONTACT_HELP,
    method: "get",
  });
}
function createDataContactHelp(param: IContactData): Promise<IAboutUsResponse> {
  return fetcher({
    url: Constant.API_PATH.POST_EDIT_DATA_CONTACT_HELP,
    method: "post",
    params: param,
  });
}
function getListDataBanner(): Promise<IBannerSettingResponse> {
  return fetcher({
    url: Constant.API_PATH.GET_LIST_BANNER_SETTING,
    method: "get",
  });
}
function createListDataBanner(
  data: FormData
): Promise<{id: number; image_data: string}> {
  return fetcher({
    url: Constant.API_PATH.POST_CREATE_LIST_BANNER_SETTING,
    method: "post",
    data: data,
    headers: {"content-type": "multipart/form-data"},
  });
}
function deleteListDataBanner(id: number): Promise<IBannerSettingResponse> {
  return fetcher({
    url: Constant.API_PATH.POST_DELETE_LIST_BANNER_SETTING(id),
    method: "delete",
  });
}
function showDataBanner(id: number): Promise<IBannerListResponse> {
  return fetcher({
    url: Constant.API_PATH.GET_SHOW_BANNER_SETTING(id),
    method: "get",
  });
}
function editListDataBanner(param: {data: FormData; id: number}): Promise<any> {
  return fetcher({
    url: Constant.API_PATH.POST_EDIT_BANNER_SETTING(param.id),
    method: "post",
    data: param.data,
    headers: {"content-type": "multipart/form-data"},
  });
}
export default {
  getWinShopAboutUs,
  getDataTermServices,
  createDataTermServices,
  getDataContactHelp,
  editWinShopAboutUs,
  createDataContactHelp,
  postCreateBannerAboutUs,
  postUpdateBannerAboutUs,
  deleteBannerAboutUs,
  getListDataBanner,
  createListDataBanner,
  deleteListDataBanner,
  showDataBanner,
  editListDataBanner,
  editWinShopContactUs,
  editWinShopDistance,
};
