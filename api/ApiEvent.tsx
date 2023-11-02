import {IEventPrize, ITableResponse} from "@app/types";
import {fetcher} from "@app/api/Fetcher";
import Constant from "@app/api/Constant";
import Config from "../config";
import {IStoreTableQuery} from "@app/api/ApiStore";

export interface IEventTableQuery {
  sort_participants?: string;
  sort_checkin?: string;
  sort_purchased?: string;
  category?: number;
  page?: number;
  perpage?: number;
  status?: number[] | undefined;
}

export interface IEventTableResponse {
  id: number;
  key?: number;
  name: string;
  description?: string;
  logo?: {
    file_id?: number;
    image_data?: string;
  };
  status: number;
  start_date: string;
  end_date: string;
  participants_count: number;
  non_buy_count: number;
  buy_count: number;
}
export interface IBannerEvent {
  id?: number;
  image_data?: string;
  file_id?: number;
}
export interface IEventDetailResponse {
  id?: number;
  name?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  participants_count?: number;
  business_count?: number;
  banner?: IBannerEvent[];
  status?: number;
  checkin?: string;
  purchased?: string;
  logo?: string;
  purchased_code?: number;
  checkin_code?: number;
  prizes?: IEventPrize[];
}

export interface IGenerateQrCodeParam {
  event: string | string[];
  type: number;
  store: string | string[];
}

export interface IResponseParticipants {
  participants: any;
  prizes: any;
}

export interface IStoreQrTableResponse {
  id: number;
  key?: number;
  name: string;
  logo?: string;
  email?: string;
  phone?: number;
  owner?: string;
  category: {id: number; name: string}[];
  imageCheckin: string;
  imagePurchase: string;
  codeCheckin: string;
  codePurchase: string;
}

export interface IParamParticipants {
  page?: number;
  perpage?: number;
  keyword?: string;
  sort_total_point?: string | null;
  sort_checkin?: string | null;
  sort_purchased?: string | null;
}

export interface IGenerateQrcodeRes {
  code: string;
  image: string;
}

function getListEvent(
  params?: IEventTableQuery,
  keyword?: number // TODO
): Promise<ITableResponse<IEventTableResponse[]>> {
  return fetcher<ITableResponse<IEventTableResponse[]>>({
    url: Constant.API_PATH.GET_LIST_EVENT,
    method: "get",
    params: params,
  });
}

function createEvent(data: any): Promise<any> {
  return fetcher<any>({
    url: Constant.API_PATH.CREATE_EVENT,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

function getEventDetail(id: number): Promise<IEventDetailResponse> {
  return fetcher<IEventDetailResponse>({
    url: Constant.API_PATH.DETAIL_EVENT(id),
    method: "get",
  });
}

function updateEvent(param: {
  id: string | number;
  data: FormData;
}): Promise<IEventDetailResponse> {
  return fetcher<any>({
    url: Constant.API_PATH.UPDATE_EVENT(param.id),
    method: "post",
    data: param.data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

function editBannerEvent(data: FormData): Promise<IEventDetailResponse> {
  return fetcher<any>({
    url: Constant.API_PATH.EDIT_BANNER_EVENT,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

function deleteEvent(ids: number[]): Promise<any> {
  return fetcher<any>({
    url: Constant.API_PATH.DELETE_EVENT,
    method: "delete",
    params: {ids: ids},
  });
}

function generateQrcode(
  param: IGenerateQrCodeParam
): Promise<IGenerateQrcodeRes> {
  return fetcher<any>(
    {
      url: Constant.API_PATH.GENERATE_QR_CODE,
      method: "get",
      params: param,
      baseURL: Config.NETWORK_CONFIG.API_APP_URL,
    },
    {
      displayError: false,
    }
  );
}

function getListParticipants(
  id: string,
  param: IParamParticipants
): Promise<IResponseParticipants> {
  return fetcher({
    url: Constant.API_PATH.GET_LIST_PARTICIPANTS(id),
    method: "get",
    params: param,
  });
}

function getListBusinessQr(
  id: string,
  param: IStoreTableQuery
): Promise<ITableResponse<IStoreQrTableResponse[]>> {
  if (id) {
    return fetcher({
      url: Constant.API_PATH.GET_LIST_BUSINESS_QR(id),
      method: "get",
      params: param,
    });
  }
  return new Promise((resolve, reject) => {
    reject();
  });
}

export default {
  getListEvent,
  createEvent,
  getEventDetail,
  updateEvent,
  editBannerEvent,
  deleteEvent,
  generateQrcode,
  getListParticipants,
  getListBusinessQr,
};
