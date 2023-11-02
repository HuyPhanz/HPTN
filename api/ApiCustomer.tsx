// import {constant} from "lodash";
import {fetcher} from "./Fetcher";
import Constant from "@app/api/Constant";
// import {number} from "yup";

export interface IGetListItemResponse {
  ids?: number[];
  id?: number;
  email?: string;
  fullname?: string;
  phone?: string;
  created_at?: string;
  status?: number | null;
  total_point?: string;
  checked_in_point?: string;
  purchased_point?: string;
}
export interface IGetListLinkResponse {
  url?: null;
  label?: string;
  active?: boolean;
}
export interface IParamCustumer {
  page?: number;
  perpage?: number;
  keyword?: string;
  status?: number[] | null;
  verify?: number[] | null;
  order_by_total_point?: string | null;
  order_by_check_in?: string | null;
  order_by_check_purchase?: string | null;
}

export interface IGetListResponse {
  current_page?: number;
  data?: IGetListItemResponse[];
  total?: number;
  first_page_url?: string;
  from?: number;
  last_page?: number;
  last_page_url?: string;
  link?: IGetListLinkResponse[];
  next_page_url?: null;
  path?: string;
  per_page?: number;
  prev_page?: number;
  to?: number;
}

function getListCustomer(params: IParamCustumer): Promise<IGetListResponse> {
  return fetcher({
    url: Constant.API_PATH.GET_CUSTOMER,
    method: "get",
    params: params,
  });
}
function editCustomer(params: IGetListItemResponse): Promise<IGetListResponse> {
  return fetcher({
    url: Constant.API_PATH.POST_EDIT_CUSTOMER,
    method: "post",
    params: params,
  });
}
function changeStatusCustomer(
  param: IGetListItemResponse
): Promise<IGetListResponse> {
  return fetcher({
    url: Constant.API_PATH.POST_CHANGE_STATUS_CUSTOMER,
    method: "post",
    params: param,
  });
}
function deleteCustomer(
  param: IGetListItemResponse
): Promise<IGetListResponse> {
  return fetcher({
    url: Constant.API_PATH.DELETE_CUSTOMER,
    method: "delete",
    params: param,
  });
}
export default {
  getListCustomer,
  editCustomer,
  changeStatusCustomer,
  deleteCustomer,
};
